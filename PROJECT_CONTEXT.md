# Project Context - LiteTk QA Learning Repo

## Proposito

Este repositorio es un laboratorio de aprendizaje para QA Engineering avanzado. No es una sola aplicacion productiva: es un conjunto de ejercicios por semana para practicar automatizacion web, pruebas API, patrones de Page Object Model, ejecucion local, Docker, Kafka, evidencias de prueba y CI/CD con GitHub Actions.

La idea de trabajo recomendada es tratar este archivo como un documento vivo. Cada vez que se agregue un reto, pipeline, contenedor, suite o patron nuevo, conviene actualizar esta guia para mantener el contexto del proyecto.

## Mapa general

```text
Repo_LiteTk/
  Semana_2/
    Cypress/JavaScript/npm/curso/
      api/
      e2e/
    Playwright/
      Java/maven/curso/
        api/
        e2e/
      TypeScript/npm/curso/
        api/
        e2e/
      javascript/npm/curso/
        api/
        e2e/
    Selenium/Java/
      clean/curso/
        api/
        e2e/
        lib/
        config/
      maven/curso/
        api/
        e2e/
    practica/
      java/demo/
      playwright/
    ejecutar-todo.ps1
    ejecutar-todo-pokeapi.ps1
    validar-pokeapi-tests.ps1
  Semana_3/
    dia-4-kafka-docker/
      backend/
      frontend/
      tests/
      docker-compose.yml
    dia-5-testops-cicd/
```

## Semana 2 - QA Multi Framework

Semana 2 funciona como un catalogo comparativo de automatizacion. El mismo dominio de aprendizaje se repite con distintas herramientas para comparar sintaxis, arquitectura y ergonomia.

### Objetivos tecnicos

- Practicar pruebas API con public APIs como JSONPlaceholder y PokeAPI.
- Practicar pruebas E2E contra ParaBank.
- Comparar Selenium, Playwright y Cypress.
- Comparar Java, JavaScript y TypeScript.
- Practicar Page Object Model en dos estilos:
  - POM clasico: una clase representa una pagina y concentra locators + acciones.
  - POM separado: archivos de locators y archivos de actions por separado.
- Generar evidencias de ejecucion, como capturas y reportes.

### Tecnologias detectadas

- Node.js / npm.
- Playwright Test en JavaScript y TypeScript.
- Cypress en JavaScript.
- Java 17.
- Maven.
- JUnit 5.
- Selenium WebDriver.
- Rest Assured para algunas pruebas API Java Maven.
- JDK HttpClient en el enfoque Java clean.
- PowerShell para scripts de ejecucion por lotes.

### Scripts principales

- `Semana_2/validar-pokeapi-tests.ps1`: ejecuta suites enfocadas en API/PokeAPI en varios frameworks.
- `Semana_2/ejecutar-todo-pokeapi.ps1`: valida API y E2E por framework, registra PASS/FAIL y resume resultados.
- `Semana_2/ejecutar-todo.ps1`: intenta ejecutar el conjunto amplio de proyectos de Semana 2.

Los scripts descargan Maven localmente si `mvn` no esta instalado. Los proyectos Node usan `npm ci` cuando existe `package-lock.json`, o `npm install` cuando no existe.

## Semana 3 - Kafka, Docker, TestOps y CI/CD

Semana 3 ya se parece mas a un laboratorio de sistema distribuido pequeno.

### Dia 4 - Kafka + Docker

La carpeta `Semana_3/dia-4-kafka-docker` contiene una app de laboratorio para entender procesamiento asincrono:

- `backend/`: API Node.js con Express y KafkaJS.
- `frontend/`: UI React + Vite + TypeScript.
- `tests/`: suite Playwright para validar comportamiento asincrono.
- `docker-compose.yml`: levanta Kafka, Kafka UI y crea el topic.

### Flujo funcional

1. El usuario crea una transferencia desde el frontend o por API.
2. `backend/server.js` guarda la transaccion en `backend/db.json` con estado `PENDIENTE`.
3. El backend publica un evento en Kafka al topic `transferencias-creadas`.
4. `backend/worker.js` consume el evento.
5. El worker espera segun el perfil de simulacion:
   - `FAST_5`
   - `FAST_10`
   - `FAST_15`
   - `SLOW_TIMEOUT`
   - `RANDOM`
6. El worker actualiza `db.json` con estado terminal:
   - `APROBADO`
   - `ERROR_TIMEOUT`
7. Frontend y pruebas consultan `GET /api/status/:id` hasta observar el estado final.

### Endpoints del backend

- `GET /`: respuesta informativa del servicio.
- `GET /health`: healthcheck basico.
- `POST /api/transfer`: crea transferencia, persiste estado inicial y publica evento Kafka.
- `GET /api/status/:id`: consulta el estado actual de una transaccion.

### Pruebas Playwright de Dia 4

Archivo principal: `Semana_3/dia-4-kafka-docker/tests/e2e-async.spec.ts`.

Casos principales:

- Smoke API: valida que la lectura inmediata no sea terminal.
- Polling API: espera checkpoints y adjunta tiempo de respuesta.
- API pool: crea multiples transacciones para el mismo target y valida IDs distintos.
- Distribucion 80/20: valida que al menos 80% de casos controlados terminen por debajo de 20s.

La suite adjunta evidencias JSON al reporte Playwright.

### Docker Compose

`docker-compose.yml` levanta:

- Kafka `apache/kafka:3.8.0` en `localhost:9092`.
- Kafka UI en `http://localhost:8081`.
- Un contenedor de inicializacion que crea el topic `transferencias-creadas`.

## Estado de CI/CD

Dia 5 cuenta con un workflow real en `.github/workflows/qa-pipeline.yml`.

El pipeline cubre:

- Checkout del repo.
- Setup de Node.js.
- Instalacion de dependencias.
- Levantamiento de Kafka con Docker Compose para Dia 4.
- Ejecucion de pruebas Playwright.
- Publicacion de reportes como artifacts.

## Riesgos y deuda tecnica observada

- No existe `README.md` raiz, por lo que el punto de entrada para alguien nuevo todavia no esta centralizado.
- Hay varios README con problemas de encoding/mojibake: algunas palabras con tildes aparecen como texto corrupto en consola.
- La carpeta `Semana_3/dia-5-testops-cicd/.github` conserva material de clase, pero GitHub Actions solo ejecuta el workflow de la raiz.
- `backend/db.json` se usa como persistencia compartida; para aprendizaje esta bien, pero puede generar condiciones de carrera si se ejecutan muchas pruebas en paralelo.
- Algunas suites E2E dependen de servicios externos como ParaBank, PokeAPI y JSONPlaceholder. Esto sirve para clase, pero puede generar fallos por red, disponibilidad externa o rate limits.
- Hay versiones distintas de Playwright entre proyectos. No es necesariamente error, pero conviene decidir si se quiere aprender comparando versiones o estandarizar.
- La app de Semana 3 tiene CORS abierto (`*`), aceptable para laboratorio local pero no para produccion.

## Ruta de aprendizaje sugerida

1. Consolidar documentacion raiz.
2. Corregir encoding de README existentes.
3. Ejecutar primero suites API de Semana 2.
4. Ejecutar luego E2E por framework para comparar POM y locators.
5. Levantar Dia 4 con Docker Compose y entender Kafka UI.
6. Automatizar Dia 4 en pipeline GitHub Actions.
7. Agregar artifacts de Playwright/Cypress/JUnit.
8. Agregar Allure o una estrategia similar de TestOps.
9. Introducir buenas practicas: tags, test data, retry controlado, reportes y separacion smoke/regression.

## Preguntas abiertas para el proyecto

1. Cual sera el framework principal para los retos futuros: Playwright TypeScript, Cypress, Selenium Java, o quieres mantener comparativas entre todos?
2. Quieres que el repo tenga un `README.md` raiz con ruta de aprendizaje paso a paso?
3. El pipeline de GitHub Actions debe ejecutar todo el repo o solo una suite smoke rapida al principio?
4. Quieres que Dia 4 se ejecute en CI con Docker Compose completo, incluyendo Kafka, backend, worker, frontend y Playwright?
5. Vas a usar Allure TestOps real, Allure Report local, o solo artifacts nativos de GitHub Actions por ahora?
6. Prefieres que corrijamos encoding y tildes en los README existentes, o dejamos los archivos como estan para no mezclar cambios?
7. El objetivo del curso es practicar mas la teoria de QA o construir un portfolio tecnico demostrable?
8. Quieres que cada reto nuevo tenga una explicacion tipo clase antes del codigo, una solucion directa, o ambos?
9. Debemos evitar dependencias de APIs externas en CI usando mocks, o quieres mantenerlas para practicar pruebas contra servicios reales?
10. Que sistema operativo quieres priorizar en instrucciones y scripts: Windows/PowerShell, Linux/bash para CI, o ambos?

## Como deberia ayudarte Codex en este repo

Para futuras tareas, el modo de trabajo recomendado es:

1. Leer el modulo concreto del reto.
2. Explicar brevemente que hacen las clases, tests o archivos involucrados.
3. Proponer el cambio o reto en terminos de aprendizaje.
4. Implementar el cambio en el repo.
5. Ejecutar una verificacion razonable.
6. Documentar el resultado y dejar comandos reproducibles.

Cuando el reto sea de automatizacion, conviene conectar siempre tres capas:

- Que comportamiento funcional estamos validando.
- Que tecnica de automatizacion se esta practicando.
- Como se ejecutaria localmente y en CI.
