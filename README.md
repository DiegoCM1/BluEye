# BluEye

BluEye es un proyecto integral de alertas y prevención de huracanes. Consta de una aplicación móvil/web desarrollada con React Native (Expo) y un backend en Node.js. La app obtiene datos en tiempo real de OpenWeather, evalúa riesgos y consulta un asistente de IA disponible en [ai-blueye](https://github.com/DiegoCM1/ai-blueye).

## Características principales
- **Alertas en tiempo real** usando información meteorológica oficial.
- **Chat de emergencia asistido por IA** para resolver dudas.
- **Mapas con capas climáticas y rutas a refugios**.
- **Modo oscuro y modo daltónico** para mejorar la accesibilidad.
- **Funcionamiento sin conexión** con los últimos datos descargados.
- **Opinión de usuarios** mediante un formulario de retroalimentación almacenado en la nube.

## Estructura del repositorio
- **frontend/** – Aplicación React Native con Expo Router. Incluye componentes compartidos para web y móvil, estilos con Tailwind y la comunicación con la IA.
- **backend/** – Servidor Express que calcula el riesgo con OpenWeather y almacena la retroalimentación en una base PostgreSQL.
- **README.md** – Documentación general del proyecto.

### Variables de entorno
- `frontend/.env.example` contiene `REACT_APP_OPENWEATHER_API_KEY` y `EXPO_PUBLIC_MIXPANEL_TOKEN` (clave de Mixpanel).
- `backend/.env.example` define `OPENWEATHER_API_KEY`, `PORT` y la cadena de conexión `DATABASE_URL` para PostgreSQL.

Los archivos `.env` se usan solo para desarrollo local y no deben versionarse. En producción define estas variables en el entorno del sistema o utiliza un gestor seguro de secretos.

## Eventos de analítica (Mixpanel)
La aplicación registra eventos en Mixpanel para entender su uso:

- `alerts_fetch_start` – sin propiedades.
- `alerts_fetch_success` – `duration_ms` (tiempo de respuesta) y `list_count` (número de alertas).
- `alerts_fetch_error` – `duration_ms` y `error` (mensaje).
- `push_permission` – `status` (`granted` o `denied`).
- `push_token_saved` – `ok` (booleano) y `error` (mensaje opcional).
- `push_received_foreground` – `alertId`.
- `push_open` – `alertId`, `alertLevel` y `origin` (`listener` o `initial`).
- `alert_card_tap` – `alertId`, `level` y `score`.
- `alert_details_view` – `alertId`, `level` y `score`.
- `details_map_tap` – `alertId`, `level` y `score`.
- `details_boletin_tap` – `alertId`, `level` y `score`.
- `screen_view` – `screen` (ruta actual).
- `app_background` – sin propiedades.
- `theme_change` – `theme` (`light` o `dark`).
- `feedback_submit` – `hasText` (booleano), `length` (caracteres) y `screen`.
- `ai_screen_view` – sin propiedades.
- `ai_restart_conversation` – sin propiedades.
- `ai_message_send` – `length` (caracteres).
- `ai_response_received` – `length` (caracteres).
- `ai_response_error` – sin propiedades.

## Building for Android
Para generar un APK de prueba se utiliza **Expo EAS**:

1. Instala la CLI con `npm install -g eas-cli`.
2. Dentro de `frontend/` usa el archivo `eas.json` incluido.
3. Inicia sesión con `eas login` y ejecuta:

   ```bash
   eas build --profile preview --platform android
   ```

EAS sube el proyecto y entrega un enlace para descargar el APK.

## Cómo empezar
1. Clona este repositorio y el proyecto [ai-blueye](https://github.com/DiegoCM1/ai-blueye).
2. Instala dependencias en `frontend/` y `backend/` con `npm install`.
3. Copia los archivos `.env.example` y completa las claves necesarias.
4. En `frontend/` ejecuta `npx expo start` para la app.
5. En `backend/` ejecuta `npm start` para la API.

## Contribución
1. Haz un *fork* y crea una rama para tus cambios.
2. Envía un *pull request* detallando la mejora o corrección.
3. Si encuentras problemas, abre un *issue*.

“Preparados hoy, seguros mañana”. 🌀
