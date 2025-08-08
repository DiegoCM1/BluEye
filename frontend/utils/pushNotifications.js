// frontend/utils/pushNotifications.js
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Alert, Platform } from 'react-native';
import Toast from 'react-native-toast-message';
import { track } from './analytics';



export async function registerForPushNotificationsAsync() {
  if (!Device.isDevice) {
    console.log('Push solo funciona en dispositivo físico');
    return null;
  }

  // 1) Permisos
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  const finalStatus =
    existingStatus === 'granted'
      ? existingStatus
      : (await Notifications.requestPermissionsAsync()).status;

  if (finalStatus !== 'granted') {
    Alert.alert(
      'Permiso denegado',
      'Sin permiso no se pueden recibir alertas de huracán'
    );
    return null;
  }

  // 2) Token nativo FCM (HTTP v1)
  const { data: fcmToken } = await Notifications.getDevicePushTokenAsync();
  console.log('FCM token →', fcmToken);

  try {
    await fetch('https://metaquetzal-production.up.railway.app/api/push-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: fcmToken }),
    });
    console.log('Token enviado al backend (frontend)');
    track('push_token_saved', { ok: true });

  } catch (error) {
    console.error('Error enviando token al backend:', error);
     track('push_token_saved', { ok: false, error: String(error?.message || error) });

  }
  // TODO: envíalo a tu backend
  return fcmToken;
}

// Muestra un banner sencillo cuando llega la notificación
export function setForegroundNotificationHandler() {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: false, // 👈 evitamos el alert nativo
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });

  Notifications.addNotificationReceivedListener((notif) => {
    const { title, body } = notif.request.content;
    Toast.show({ text1: title, text2: body });
  });
}

// Devuelve el unsubscribe para limpiarlo en unuseEffect
export function addNotificationResponseListener(onTap) {
  return Notifications.addNotificationResponseReceivedListener((response) => {
    const data = response.notification.request.content.data;
    onTap(data); // envía los datos al callback que definas en el layout
  });
}
