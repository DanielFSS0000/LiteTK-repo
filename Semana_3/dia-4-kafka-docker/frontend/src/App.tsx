import React, { useState } from 'react';

const API_URL = 'http://localhost:3000';

const panelStyle: React.CSSProperties = {
  background: '#1e293b',
  padding: 30,
  borderRadius: 12,
  border: '1px solid #334155',
  width: 'min(520px, 100%)',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: 10,
  fontSize: 16,
  marginTop: 6,
  marginBottom: 14,
  borderRadius: 6,
  border: 'none',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  textAlign: 'left',
  fontWeight: 700,
};

const buttonStyle: React.CSSProperties = {
  padding: 10,
  fontSize: 16,
  borderRadius: 6,
  border: 'none',
  background: '#ffd100',
  color: '#000',
  fontWeight: 'bold',
  cursor: 'pointer',
};

function RegistrationStatus({ status }: { status: string }) {
  const colorByStatus: Record<string, string> = {
    'Esperando registro...': '#f59e0b',
    Procesando: '#f59e0b',
    'Usuario Creado Exitosamente': '#10b981',
    COMPLETA_LOS_CAMPOS: '#ef4444',
    ERROR_CONSULTANDO_ESTADO: '#ef4444',
    ERROR_REGISTRANDO_USUARIO: '#ef4444',
    ERROR_PUBLICACION: '#ef4444',
  };

  return (
    <div
      id="registration-status"
      data-testid="registration-status"
      aria-live="polite"
      style={{ marginTop: 20, fontSize: 22, fontWeight: 'bold', color: colorByStatus[status] || '#f59e0b' }}
    >
      Estado: {status}
    </div>
  );
}

function TransferForm() {
  const [target, setTarget] = useState('');
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState('Esperando transaccion...');
  const [statusColor, setStatusColor] = useState('#f59e0b');
  const [intervalId, setIntervalId] = useState<number | null>(null);

  const enviarPago = async () => {
    if (!target || !amount) {
      setStatus('COMPLETA_LOS_CAMPOS');
      setStatusColor('#ef4444');
      return;
    }
    try {
      setStatus('PENDIENTE');
      setStatusColor('#f59e0b');

      const response = await fetch(`${API_URL}/api/transfer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target, amount })
      });

      if (!response.ok) {
        throw new Error(`Error HTTP ${response.status}`);
      }

      const data = await response.json();

      if (intervalId) clearInterval(intervalId);

      const poll = window.setInterval(async () => {
        try {
          const resStatus = await fetch(`${API_URL}/api/status/${data.id}`);
          const statusData = await resStatus.json();

          setStatus(statusData.status);

          if (statusData.status === 'APROBADO') {
            setStatusColor('#10b981');
            clearInterval(poll);
          } else if (statusData.status === 'ERROR_TIMEOUT') {
            setStatusColor('#ef4444');
            clearInterval(poll);
          } else {
            setStatusColor('#f59e0b');
          }
        } catch {
          setStatus('ERROR_CONSULTANDO_ESTADO');
          setStatusColor('#ef4444');
          clearInterval(poll);
        }
      }, 1000);

      setIntervalId(poll);
    } catch {
      setStatus('ERROR_ENVIANDO_TRANSFERENCIA');
      setStatusColor('#ef4444');
    }
  };

  return (
    <section style={panelStyle} aria-labelledby="transfer-title">
      <h2 id="transfer-title">Portal de Pagos</h2>
      <label style={labelStyle} htmlFor="target-account">Cuenta Destino</label>
      <input
        id="target-account"
        type="text"
        placeholder="Ej: 98765"
        value={target}
        onChange={e => setTarget(e.target.value)}
        style={inputStyle}
      />
      <label style={labelStyle} htmlFor="amount">Monto</label>
      <input
        id="amount"
        type="number"
        placeholder="$"
        value={amount}
        onChange={e => setAmount(e.target.value)}
        style={inputStyle}
      />
      <button onClick={enviarPago} style={buttonStyle}>Enviar Transferencia</button>
      <div id="status-box" style={{ marginTop: 20, fontSize: 22, fontWeight: 'bold', color: statusColor }}>
        Estado: {status}
      </div>
    </section>
  );
}

function RegistrationForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('Esperando registro...');
  const [intervalId, setIntervalId] = useState<number | null>(null);

  const registerUser = async () => {
    if (!name || !email || !password) {
      setStatus('COMPLETA_LOS_CAMPOS');
      return;
    }

    try {
      setStatus('Procesando');

      const response = await fetch(`${API_URL}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });

      const data = await response.json();
      if (!response.ok) {
        setStatus(data.status || 'ERROR_REGISTRANDO_USUARIO');
        return;
      }

      if (intervalId) clearInterval(intervalId);

      const poll = window.setInterval(async () => {
        try {
          const statusResponse = await fetch(`${API_URL}/api/users/status/${data.id}`);
          const statusData = await statusResponse.json();

          if (statusData.status === 'USUARIO_CREADO_EXITOSAMENTE') {
            setStatus('Usuario Creado Exitosamente');
            clearInterval(poll);
            return;
          }

          setStatus('Procesando');
        } catch {
          setStatus('ERROR_CONSULTANDO_ESTADO');
          clearInterval(poll);
        }
      }, 500);

      setIntervalId(poll);
    } catch {
      setStatus('ERROR_REGISTRANDO_USUARIO');
    }
  };

  return (
    <section style={panelStyle} aria-labelledby="registration-title">
      <h2 id="registration-title">Registro de Usuario</h2>
      <label style={labelStyle} htmlFor="user-name">Nombre</label>
      <input
        id="user-name"
        data-testid="user-name"
        type="text"
        value={name}
        onChange={event => setName(event.target.value)}
        style={inputStyle}
      />
      <label style={labelStyle} htmlFor="user-email">Email</label>
      <input
        id="user-email"
        data-testid="user-email"
        type="email"
        value={email}
        onChange={event => setEmail(event.target.value)}
        style={inputStyle}
      />
      <label style={labelStyle} htmlFor="user-password">Contrasena</label>
      <input
        id="user-password"
        data-testid="user-password"
        type="password"
        value={password}
        onChange={event => setPassword(event.target.value)}
        style={inputStyle}
      />
      <button data-testid="register-button" onClick={registerUser} style={buttonStyle}>Registrar</button>
      <RegistrationStatus status={status} />
    </section>
  );
}

export default function App() {
  return (
    <main style={{ background: '#0f172a', color: '#fff', minHeight: '100vh', fontFamily: 'sans-serif', padding: 50 }}>
      <h1 style={{ textAlign: 'center' }}>Lite Bank</h1>
      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', justifyContent: 'center' }}>
        <RegistrationForm />
        <TransferForm />
      </div>
    </main>
  );
}
