# Dia 5: TestOps y CI/CD

Este dia toma el ejercicio del Dia 4 y lo lleva a automatizacion en pipeline con GitHub Actions.

## Que incluye

- Pipeline QA en `.github/workflows/qa-pipeline.yml`.
- Ejecucion automatica de la app asincrona del Dia 4.
- Kafka levantado con Docker Compose.
- Backend y worker ejecutados en segundo plano.
- Build del frontend React/Vite.
- Pruebas Playwright.
- Artifacts con reporte Playwright, reporte Allure local, resultados Allure crudos y logs de servicios.
- Integracion opcional con Allure TestOps mediante secrets.

## Como se ejecuta

El workflow se dispara automaticamente cuando haces push o pull request hacia `main` o `master`.

Tambien se puede ejecutar manualmente:

1. Abre el repositorio en GitHub.
2. Ve a la pestana `Actions`.
3. Selecciona `LiteTk QA Pipeline`.
4. Haz clic en `Run workflow`.

## Importante

GitHub Actions solo detecta workflows ubicados en la raiz del repositorio:

```text
.github/workflows/qa-pipeline.yml
```

La carpeta `.github` que queda dentro de `Semana_3/dia-5-testops-cicd/` sirve como material de clase, pero no dispara pipelines por si sola.

## Allure TestOps opcional

Si quieres enviar resultados a Allure TestOps, configura estos secrets en GitHub:

- `ALLURE_ENDPOINT`
- `ALLURE_TOKEN`
- `ALLURE_PROJECT_ID`

Si no existen, el pipeline ejecuta Playwright normalmente y guarda artifacts nativos de GitHub Actions.

## Reportes generados

Cada ejecucion del pipeline publica estos artifacts:

- `playwright-report`: HTML nativo de Playwright.
- `allure-report`: HTML generado con Allure Report local.
- `allure-results`: resultados crudos de Allure para reprocesar o enviar a otra herramienta.
- `service-logs`: logs del backend y worker.

Ademas, cuando el pipeline corre en `main`, publica el ultimo `allure-report` en GitHub Pages para abrirlo sin descargar artifacts:

```text
https://danielfss0000.github.io/LiteTK-repo/
```

Si GitHub Pages no esta activo todavia, ve a `Settings > Pages` y selecciona `GitHub Actions` como fuente de publicacion.

Para ver Allure Report:

1. Entra al run de GitHub Actions.
2. Descarga el artifact `allure-report`.
3. Descomprime el archivo.
4. Sirve la carpeta por HTTP desde la raiz del repo:

```powershell
node scripts/serve-report.js allure-report 5050
```

5. Abre `http://localhost:5050`.

Si prefieres abrirlo desde la carpeta descomprimida del artifact, tambien puedes ejecutar:

```powershell
node serve-report.js . 5050
```

No abras `index.html` directamente con doble clic. Allure carga archivos JSON con `fetch`; si se abre como `file://`, el navegador puede mostrar tarjetas `500 Failed to fetch`.

## Objetivo de aprendizaje

- Entender como pasar de ejecucion local a ejecucion automatizada.
- Ver evidencias de calidad desde CI para tomar decisiones de release.
- Practicar TestOps con reportes, logs y ejecuciones reproducibles.
