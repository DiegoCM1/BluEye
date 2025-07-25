// src/services/firebase.js
import admin from 'firebase-admin';

// ➊  Inicializa usando la credencial que toma de la variable
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  projectId: 'blue-eye-4dbfc',     // tu ID de proyecto
});

// ➋  Exporta el cliente de mensajería para usarlo en otros módulos
export const messaging = admin.messaging();
