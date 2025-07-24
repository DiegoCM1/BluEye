# Backend de BluEye

Este backend está construido con Node.js y Express. Calcula el riesgo meteorológico usando datos de OpenWeather, guarda alertas y recibe comentarios de los usuarios. El asistente de IA se encuentra en el proyecto [ai-blueye](https://github.com/DiegoCM1/ai-blueye).

## Instalación rápida
1. Copia `.env.example` a `.env` y agrega tu `OPENWEATHER_API_KEY`.
2. Ejecuta `npm install` para instalar las dependencias.
3. Inicia el servidor con `npm start` (o `npm run dev` si prefieres usar nodemon).

El servidor escucha en el puerto definido por `PORT` (3002 por defecto) y se conecta a PostgreSQL usando las variables `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASS`, `DB_NAME` y `DB_SSL`.

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

## Contribuir
1. Haz *fork* y crea una rama con tu propuesta.
2. Envía un *pull request* descriptivo.
3. Reporta errores mediante *issues*.
