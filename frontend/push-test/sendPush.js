// sendPush.js
console.log('VAR =>', process.env.GOOGLE_APPLICATION_CREDENTIALS);


const admin = require('firebase-admin');
 
admin.initializeApp({
  credential: admin.credential.applicationDefault(), // ← leerá %GOOGLE_APPLICATION_CREDENTIALS%
    projectId: 'blue-eye-4dbfc'
});

const registrationToken = 'd8P2NK5sQfyNvOS6FEt8tY:APA91bEsckfrvJTneGRmv0IXfGEMBQd969cK6O5fdgUmEUswADXC6kHh860Kj81F7SkFZIcUnsDd0Y7PpdtcCwhsj19pPTTrIjwGmLUMyIrdnhrQ91QnFhk';

const message = {
  token: registrationToken,
  notification: {
    title: 'Huracán Patricia a 100km',
    body: 'Pulsa para más detalles',
  },
data: { alertId: '123' }   // <-- payload que leerá el listener

};

admin
  .messaging()
  .send(message)
  .then((response) => {
    console.log('✅ Push enviado, ID:', response);
  })
  .catch((error) => {
    console.error('❌ Error al enviar:', error);
  });
