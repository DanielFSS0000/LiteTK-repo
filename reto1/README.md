# Reto 1 - Transferencias con Polling

Este reto automatiza el frontend existente de Lite Bank para validar el flujo de
transferencias asincronas.

## Aplicacion Bajo Prueba

- Frontend: `http://127.0.0.1:5173`
- Backend: `http://localhost:3000`
- Kafka UI: `http://localhost:8081`
- Topic: `transferencias-creadas`

## Por Que Este Reto Usa Transferencias

El enunciado original pedia registro de usuario, pero inicialmente el repo solo
tenia implementado el flujo de transferencias. Para no mezclarlo con la carpeta
oficial entregada despues por el profesor, este reto queda separado como
`reto1`.

## Como Ejecutar

Desde la raiz del repo, levantar Kafka con Docker:

```powershell
docker-compose -f .\Semana_3\dia-4-kafka-docker\docker-compose.yml up -d
```

Levantar backend:

```powershell
cd .\Semana_3\dia-4-kafka-docker\backend
npm run start-server
```

Levantar worker:

```powershell
cd .\Semana_3\dia-4-kafka-docker\backend
npm run start-worker
```

Levantar frontend:

```powershell
cd .\Semana_3\dia-4-kafka-docker\frontend
npm run dev
```

Ejecutar prueba:

```powershell
cd .\reto1
npm test
```

Ejecutar 3 veces seguidas:

```powershell
npm test -- --repeat-each=3
```

Generar reporte Allure local:

```powershell
npm run report:allure
```

## Decisiones Tecnicas

- Se usa Page Object Model en `pages/TransferPage.ts`.
- El test no usa `sleep`; espera dinamicamente el estado `APROBADO`.
- Se usa `workers: 1` porque el flujo depende de Kafka y un worker asincrono.
- El test fuerza `FAST_5` con `speedFactor: 0.1` desde Playwright para evitar que
  el escenario aleatorio del backend genere flakiness.
- El pipeline genera `allure-results` y construye `allure-report` como artifact.
- GitHub Pages se publica cuando el workflow corre en `main` o `master`, porque
  el environment `github-pages` del repo no permite despliegues desde ramas de
  trabajo.
