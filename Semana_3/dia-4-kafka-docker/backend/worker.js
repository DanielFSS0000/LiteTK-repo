const { Kafka } = require('kafkajs');
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'db.json');
const KAFKA_BROKER = process.env.KAFKA_BROKER || 'localhost:9092';

const kafka = new Kafka({
  clientId: 'bank-worker',
  brokers: [KAFKA_BROKER]
});
const consumer = kafka.consumer({ groupId: 'bank-processing-group' });

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function readDb() {
  let lastError;

  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const rawDb = fs.readFileSync(DB_PATH, 'utf-8');
      const db = JSON.parse(rawDb);
      db.transactions = db.transactions || {};
      db.users = db.users || {};
      return db;
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError;
}

function writeDb(db) {
  db.transactions = db.transactions || {};
  db.users = db.users || {};
  const tempPath = `${DB_PATH}.tmp`;
  fs.writeFileSync(tempPath, JSON.stringify(db, null, 2));
  fs.renameSync(tempPath, DB_PATH);
}

function resolveSimulation(simulationProfile) {
  const profile = String(simulationProfile || 'RANDOM').toUpperCase();

  switch (profile) {
    case 'FAST_5':
      return { delayMs: 5000, finalStatus: 'APROBADO', bucket: 'FAST_5' };
    case 'FAST_10':
      return { delayMs: 10000, finalStatus: 'APROBADO', bucket: 'FAST_10' };
    case 'FAST_15':
      return { delayMs: 15000, finalStatus: 'APROBADO', bucket: 'FAST_15' };
    case 'SLOW_TIMEOUT':
      return {
        delayMs: randomBetween(40000, 60000),
        finalStatus: 'ERROR_TIMEOUT',
        bucket: 'SLOW_TIMEOUT'
      };
    case 'RANDOM':
    default: {
      const isFast = Math.random() < 0.8;
      if (isFast) {
        return {
          delayMs: randomBetween(5000, 20000),
          finalStatus: 'APROBADO',
          bucket: 'RANDOM_FAST'
        };
      }
      return {
        delayMs: randomBetween(40000, 60000),
        finalStatus: 'ERROR_TIMEOUT',
        bucket: 'RANDOM_SLOW_TIMEOUT'
      };
    }
  }
}

function clampSpeedFactor(value) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return 1;
  }
  return Math.min(1, Math.max(0.05, parsed));
}

async function subscribeWhenTopicAvailable(topic) {
  while (true) {
    try {
      await consumer.subscribe({ topic, fromBeginning: false });
      return;
    } catch (error) {
      if (error && (error.type === 'UNKNOWN_TOPIC_OR_PARTITION' || error.code === 3)) {
        console.log(` Topico ${topic} aun no disponible, reintentando en 2s...`);
        await delay(2000);
        continue;
      }
      throw error;
    }
  }
}

async function processTransfer(txId, eventData) {
  const simulation = resolveSimulation(eventData.simulationProfile);
  const speedFactor = clampSpeedFactor(eventData.speedFactor);
  const finalDelayMs = Math.max(200, Math.floor(simulation.delayMs * speedFactor));

  console.log(
    ` Procesando ${txId} | profile=${eventData.simulationProfile || 'RANDOM'} | bucket=${simulation.bucket} | delay=${finalDelayMs}ms`
  );
  await delay(finalDelayMs);

  const db = readDb();
  if (!db.transactions[txId]) {
    return;
  }

  const createdAt = Number(db.transactions[txId].createdAt || Date.now());
  const processedAt = Date.now();
  db.transactions[txId].status = simulation.finalStatus;
  db.transactions[txId].workerBucket = simulation.bucket;
  db.transactions[txId].processedAt = processedAt;
  db.transactions[txId].responseTimeMs = processedAt - createdAt;
  db.transactions[txId].effectiveDelayMs = finalDelayMs;
  writeDb(db);

  console.log(JSON.stringify({
    timestamp: new Date().toISOString(),
    level: 'INFO',
    service: 'bank-worker',
    message: 'Transaccion procesada',
    transactionId: txId,
    status: simulation.finalStatus,
    bucket: simulation.bucket,
    effectiveDelayMs: finalDelayMs
  }));
}

async function processUserRegistration(userId, eventData) {
  const finalDelayMs = randomBetween(3000, 5000);

  console.log(` Procesando registro ${userId} | delay=${finalDelayMs}ms`);
  await delay(finalDelayMs);

  const db = readDb();
  if (!db.users[userId]) {
    return;
  }

  const createdAt = Number(db.users[userId].createdAt || Date.now());
  const processedAt = Date.now();
  db.users[userId].status = 'USUARIO_CREADO_EXITOSAMENTE';
  db.users[userId].processedAt = processedAt;
  db.users[userId].responseTimeMs = processedAt - createdAt;
  db.users[userId].effectiveDelayMs = finalDelayMs;
  writeDb(db);

  console.log(JSON.stringify({
    timestamp: new Date().toISOString(),
    level: 'INFO',
    service: 'bank-worker',
    message: 'Usuario creado',
    userId,
    email: eventData.email,
    effectiveDelayMs: finalDelayMs
  }));
}

async function runWorker() {
  await consumer.connect();
  await subscribeWhenTopicAvailable('transferencias-creadas');
  await subscribeWhenTopicAvailable('registro-usuarios');
  console.log(" Escuchando eventos en los topicos 'transferencias-creadas' y 'registro-usuarios'...");

  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      const eventData = JSON.parse(message.value.toString());
      const messageId = message.key.toString();

      console.log(JSON.stringify({
        timestamp: new Date().toISOString(),
        level: 'INFO',
        service: 'bank-worker',
        message: 'Evento recibido de Kafka',
        topic,
        messageId,
        data: eventData
      }));

      if (topic === 'transferencias-creadas') {
        await processTransfer(messageId, eventData);
        return;
      }

      if (topic === 'registro-usuarios') {
        await processUserRegistration(messageId, eventData);
      }
    }
  });
}

runWorker().catch(console.error);
