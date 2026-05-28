# Test - Automatizacion Front-End

Suite Playwright para el frontend oficial de registro de usuario entregado en
`Automatizacion_Front-End/src`.

## Aplicacion Bajo Prueba

- URL local: `http://localhost:3000`
- Contenedor: `auto-frontend-app`
- Flujo: Registro de Usuario

## Como Levantar La App

Desde `Automatizacion_Front-End/src`:

```powershell
docker compose up --build -d
```

Abrir:

```text
http://localhost:3000
```

## Como Ejecutar Los Tests

Desde `Automatizacion_Front-End/test`:

```powershell
npm install
npm test
```

Ejecutar 3 veces seguidas:

```powershell
npm test -- --repeat-each=3
```

## Decisiones Tecnicas

- Se usa TypeScript para los tests.
- Se aplica Page Object Model en `pages/RegistroPage.ts`.
- El test no usa esperas fijas; Playwright espera dinamicamente el cambio de
  estado hasta `Usuario Creado Exitosamente`.
- Los datos de prueba se generan con timestamp para evitar repetir emails.
