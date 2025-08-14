# Frontend de BluEye

Este paquete contiene la app realizada con React Native y Expo. Utiliza **Expo Router** para la navegación y comparte código entre la versión móvil y la web mediante componentes diferenciados `Main.native.jsx` y `Main.web.jsx`. Incluye además una pantalla de feedback para enviar comentarios al servidor.

## Uso rápido
1. Ejecuta `npm install` para instalar las dependencias.
2. Copia `.env.example` a `.env` y coloca tus claves. **No subas este archivo al repositorio**; guarda los secretos en variables de entorno o un servicio seguro.
3. Inicia la aplicación con `npx expo start` y sigue las instrucciones para abrirla en tu dispositivo, emulador o navegador.

## Estructura relevante
- `app/` – pantallas de la aplicación y la definición de rutas.
- `components/` – componentes reutilizables e indicadores de categoría de huracán.
- `context/` – proveedores de tema y modo daltónico.
- `global.css` y `tailwind.config.js` – estilos con Tailwind y colores personalizados.
- `api/sendMessage.jsx` – helper que envía preguntas al asistente alojado en [ai-blueye](https://github.com/DiegoCM1/ai-blueye).
- `FeedbackScreen.jsx` – formulario para enviar feedback que se guarda en el backend.
- `components/Main.native.jsx` - Using [Google Maps SDK](https://developers.google.com/maps/documentation/android-sdk/ui-settings) trough Expo: [react-native-maps](https://docs.expo.dev/versions/latest/sdk/map-view/)
- `services/feedbackService.js` – helper para comunicar la app con la API de feedback.

## Compilar con EAS
Dentro de `frontend/` existe `eas.json` para crear APKs de prueba. Tras iniciar sesión con `eas login` ejecuta:

```bash
eas build --profile preview --platform android
```

## Contribuir
1. Crea una rama desde tu *fork* con los cambios que desees proponer.
2. Abre un *pull request* y describe tu aportación.
3. Para reportar errores usa los *issues* del repositorio.
