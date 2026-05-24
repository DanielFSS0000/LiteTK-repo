# Spec - Reto TestOps Automation Front-End

## Contexto

Este reto implementa y automatiza el flujo de "Registro de Usuario" en Lite Bank.
El objetivo pedagogico es practicar automatizacion front-end con Playwright, Page
Object Model, pruebas resilientes para procesos asincronos, Docker, Kafka y CI/CD.

## Alcance

- Agregar en Lite Bank una pantalla de registro de usuario.
- Enviar el registro al backend.
- Publicar un evento en Kafka en el topic `registro-usuarios`.
- Procesar el evento de forma asincrona desde el worker.
- Consultar el estado hasta que el usuario quede creado.
- Automatizar el flujo E2E con Playwright.
- Ejecutar el test desde GitHub Actions.

## Servicios Involucrados

- Frontend Lite Bank: `http://localhost:5173`
- Backend Lite Bank: `http://localhost:3000`
- Kafka UI: `http://localhost:8081`
- Kafka topic de registro: `registro-usuarios`

Aunque el enunciado menciona `http://localhost:3000` para el frontend, en este
repo ese puerto corresponde al backend. El frontend actual corre con Vite en
`http://localhost:5173`.

## Flujo Funcional

1. El usuario abre Lite Bank.
2. Completa Nombre, Email y Contrasena.
3. Hace clic en Registrar.
4. El frontend muestra `Procesando`.
5. El backend crea el usuario en estado `PROCESANDO` y publica el evento en Kafka.
6. El worker consume el evento y, tras una latencia simulada de 3 a 5 segundos,
   actualiza el estado a `USUARIO_CREADO_EXITOSAMENTE`.
7. El frontend consulta el estado de forma periodica.
8. La UI muestra `Usuario Creado Exitosamente`.

## Criterios de Aceptacion

- El test no usa esperas duras como `sleep(5000)`.
- El test espera dinamicamente el texto final con timeout maximo de 10 segundos.
- El Page Object concentra los selectores y acciones de la pagina de registro.
- Los datos de prueba generan emails unicos para evitar colisiones.
- La ejecucion local debe ser estable en 3 corridas consecutivas.
- El pipeline debe ejecutar el test en modo headless.
- Si el pipeline falla, debe publicar el reporte HTML de Playwright como artifact.

## Estructura de Automatizacion

```text
reto-testOps-automation-frontEnd/
  data/
    registro.data.js
  pages/
    RegistroPage.js
  tests/
    registro-async.spec.js
  playwright.config.js
  package.json
  README.md
  SPEC.md
```

## Decisiones Tecnicas

- Se usa Playwright Test porque ofrece auto-waiting, assertions con retry y buen
  soporte para reportes HTML.
- Se usa POM para aislar selectores y acciones del test.
- Se usan locators semanticos (`getByLabel`, `getByRole`) y `data-testid` solo
  donde aporta estabilidad.
- Se configura `workers: 1` porque Kafka procesa este flujo con un unico worker y
  el reto exige validar un timeout maximo de 10 segundos. Ejecutarlo en paralelo
  puede encolar mensajes y volver la prueba falsamente inestable.
- El backend y worker escriben `db.json` de forma atomica para evitar lecturas de
  JSON incompleto durante el procesamiento asincrono.

## Preguntas Pendientes Para Siguientes Iteraciones

- Si el reto exige evidencia visual, debemos definir donde guardar capturas.
- Si el pipeline debe publicar tambien Allure, debemos integrarlo aparte; este
  reto usa Playwright HTML report como artifact en fallos.
- Si se desea validar Kafka UI, debemos confirmar si la evidencia sera manual o
  automatizada.
