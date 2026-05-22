# Dia 5: TestOps y CI/CD

Este dia toma el ejercicio del Dia 4 y lo lleva a automatizacion en pipeline con GitHub Actions.

## Que incluye

- Pipeline QA en `.github/workflows/qa-pipeline.yml`.
- Ejecucion automatica de la app asincrona del Dia 4.
- Kafka levantado con Docker Compose.
- Backend y worker ejecutados en segundo plano.
- Build del frontend React/Vite.
- Pruebas Playwright.
- Publicacion del ultimo Allure Report en GitHub Pages.
- Artifacts con reporte Playwright y logs de servicios.
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
- `service-logs`: logs del backend y worker.

Cuando el pipeline corre en `main`, publica el ultimo Allure Report en GitHub Pages para abrirlo sin descargar artifacts:

```text
https://danielfss0000.github.io/LiteTK-repo/
```

Si GitHub Pages no esta activo todavia, el job de publicacion puede fallar aunque las pruebas pasen. Activalo una vez en `Settings > Pages` seleccionando `GitHub Actions` como fuente de publicacion; despues vuelve a ejecutar el workflow.

## Objetivo de aprendizaje

- Entender como pasar de ejecucion local a ejecucion automatizada.
- Ver evidencias de calidad desde CI para tomar decisiones de release.
- Practicar TestOps con reportes, logs y ejecuciones reproducibles.
