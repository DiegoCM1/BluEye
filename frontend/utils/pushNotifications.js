// frontend/utils/pushNotifications.js
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Alert, Platform } from 'react-native';

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

  // TODO: envíalo a tu backend
  return fcmToken;
}
