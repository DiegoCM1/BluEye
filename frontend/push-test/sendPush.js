// sendPush.js
const admin = require('firebase-admin');
const serviceAccount = require('./blue-eye-4dbfc-firebase-adminsdk-fbsvc-dda84c043c.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const registrationToken = 'd8P2NK5sQfyNvOS6FEt8tY:APA91bEsckfrvJTneGRmv0IXfGEMBQd969cK6O5fdgUmEUswADXC6kHh860Kj81F7SkFZIcUnsDd0Y7PpdtcCwhsj19pPTTrIjwGmLUMyIrdnhrQ91QnFhk';

const message = {
  token: registrationToken,
  notification: {
    title: 'Huracán Patricia a 100km',
    body: 'Pulsa para más detalles',
  },
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
