// backend/src/services/firebase.js

import admin from 'firebase-admin';

// Parseamos el JSON completo desde la variable de entorno
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Opcional: exporta admin por si lo necesitas en otros módulos
export default admin;
