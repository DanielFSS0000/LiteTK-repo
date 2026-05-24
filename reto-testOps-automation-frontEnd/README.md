# Reto TestOps - Automation Front-End

Automatizacion E2E del flujo de registro de usuario en Lite Bank.

## Alcance

- Framework: Playwright.
- Patron: Page Object Model.
- Flujo: registro de usuario asincrono.
- Validacion principal: esperar dinamicamente hasta ver `Usuario Creado Exitosamente`.
- Timeout maximo del estado final: 10 segundos.

## URLs locales

- Frontend Lite Bank: `http://localhost:5173`
- Backend Lite Bank: `http://localhost:3000`
- Kafka UI: `http://localhost:8081`

La URL del frontend es `5173` porque la app actual usa Vite. El puerto `3000` queda reservado para el backend Express.

## Estructura

```text
reto-testOps-automation-frontEnd/
  data/
    registro.data.js
  pages/
    RegistroPage.js
  tests/
    registro-async.spec.js
  package.json
  playwright.config.js
```

## Ejecutar localmente

Desde la raiz del repositorio:

```powershell
cd Semana_3\dia-4-kafka-docker
docker-compose up -d
```

En otra terminal:

```powershell
cd Semana_3\dia-4-kafka-docker\backend
npm.cmd install
npm.cmd run start-server
```

En otra terminal:

```powershell
cd Semana_3\dia-4-kafka-docker\backend
npm.cmd run start-worker
```

En otra terminal:

```powershell
cd Semana_3\dia-4-kafka-docker\frontend
npm.cmd install
npm.cmd run dev
```

Para ejecutar el reto:

```powershell
cd reto-testOps-automation-frontEnd
npm.cmd install
npx.cmd playwright install chromium
npm.cmd test
```

## Decisiones tecnicas

- Se usan locators semanticos (`getByLabel`, `getByRole`) para reducir acoplamiento al HTML.
- El POM concentra las acciones del formulario y las validaciones visibles del flujo.
- Los datos de prueba se generan con email unico para poder correr el test varias veces.
- No se usan sleeps fijos; Playwright espera el estado final con assertion auto-reintentable.
