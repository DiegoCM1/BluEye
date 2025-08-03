# Backend de BluEye

Este backend está construido con Node.js y Express. Calcula el riesgo meteorológico usando datos de OpenWeather, guarda alertas y recibe comentarios de los usuarios. El asistente de IA se encuentra en el proyecto [ai-blueye](https://github.com/DiegoCM1/ai-blueye).

## Instalación rápida
1. Copia `.env.example` a `.env` y agrega tus valores para `OPENWEATHER_API_KEY` y `DATABASE_URL`.
2. Ejecuta `npm install` para instalar las dependencias.
3. Inicia el servidor con `npm start` (o `npm run dev` si prefieres usar nodemon).

El servidor escucha en el puerto definido por `PORT` (3002 por defecto) y se conecta a PostgreSQL mediante la cadena `DATABASE_URL`.

## Estructura de carpetas
- `src/index.js` — punto de entrada de la aplicación.
- `src/routes/` — define los endpoints `/risk`, `/alerts` y `/feedback`.
- `src/controllers/` — lógica de cada ruta.
- `src/services/` — integración con OpenWeather y utilidades de análisis.
- `src/data/` — módulos de acceso a la base de datos.

## Endpoints principales
- **POST `/risk`**: evalúa el riesgo meteorológico para las coordenadas proporcionadas.
- **GET `/alerts`** y **GET `/alerts/:id`**: consulta de alertas guardadas.
- **POST `/feedback`**: almacena la opinión del usuario.

## Testeo de notificaciones
1. Agrega `export NOTIF_API_KEY="API_Key"` en tu terminal para que cargar la credencial en tu sesión actual
2. Utiliza una estructura como esta: `curl -X POST "https://metaquetzal-production.up.railway.app/api/notifications/send-all"   -H "x-api-key: $NOTIF_API_KEY"   -H "Content-Type: application/json"   -d '{"title":"️️ Lluvias intensas","body":"Tap para ver recomendaciones","data":{"alertId":"699e3e22-d19e-4 4eab-bd52-83ab405b4c53","alertLevel":"4"}}'`

## Contribuir
1. Haz *fork* y crea una rama con tu propuesta.
2. Envía un *pull request* descriptivo.
3. Reporta errores mediante *issues*.
