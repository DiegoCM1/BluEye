# Documentación completa de BluEye

## Visión general
BluEye es un proyecto de alertas y prevención de huracanes compuesto por una aplicación móvil/web creada con React Native (Expo) y un backend en Node.js. La app consulta datos en tiempo real de OpenWeather, calcula riesgos locales y se integra con un asistente de IA externo.

## Estructura del repositorio
- **frontend/**: aplicación desarrollada con Expo Router que comparte componentes entre la versión móvil y la web.
- **backend/**: servidor Express encargado del análisis meteorológico y de almacenar retroalimentación de los usuarios.
- **README.md**: guía rápida del proyecto.

## Backend
### Tecnologías
Node.js, Express, PostgreSQL y Firebase Admin.

### Archivos principales
- `src/index.js`: arranque del servidor y definición de rutas base.
- `src/routes/`: contiene las rutas `risk`, `alerts`, `feedback` y servicios para notificaciones push.
- `src/controllers/`: lógica asociada a cada ruta.
- `src/services/`: integración con OpenWeather y análisis de riesgo.
- `src/data/`: acceso a la base de datos.

### Endpoints
- `POST /risk`: evalúa el riesgo meteorológico para unas coordenadas.
- `GET /alerts` y `GET /alerts/:id`: consulta de alertas guardadas.
- `POST /feedback`: almacena comentarios de usuarios.
- Rutas bajo `/api/notifications` protegidas con `apiKeyAuth` para el envío de notificaciones.
- `GET /health` y `GET /health-db`: comprobaciones del estado del servicio y de la base de datos.

## Frontend
### Tecnologías
React Native, Expo Router, Tamagui y TailwindCSS.

### Estructura relevante
- `app/`: pantallas de la aplicación y definición de rutas.
- `components/`: componentes reutilizables como `Main.native.jsx` y `Main.web.jsx`.
- `context/`: proveedores de tema y modo daltónico.
- `services/`: helpers para comunicarse con el backend (`feedbackService.js`).
- `api/`: utilidades para interactuar con el asistente de IA (`sendMessage.jsx`).

### Funcionalidades
- Mapa interactivo con capas de viento, precipitación y nubes.
- Chat asistido por IA para consultas rápidas.
- Formulario de retroalimentación que envía datos al backend.

## Variables de entorno
- `frontend/.env.example` define `REACT_APP_OPENWEATHER_API_KEY`.
- `backend/.env.example` especifica `OPENWEATHER_API_KEY`, `PORT` y `DATABASE_URL`.

## Scripts útiles
- **Backend**: `npm start` inicia el servidor; `npm run dev` usa nodemon para desarrollo.
- **Frontend**: `npm start` abre Expo; `npm run lint` ejecuta ESLint.

## Contribución
1. Realiza un *fork* del repositorio y crea una rama con tus cambios.
2. Envía un *pull request* describiendo la mejora o corrección propuesta.
3. Reporta problemas mediante *issues*.

*“Preparados hoy, seguros mañana”* 🌀
