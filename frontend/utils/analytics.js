// frontend/utils/analytics.js
import { Mixpanel } from 'mixpanel-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

let mp = null;

async function getDistinctId() {
  const KEY = 'mp_distinct_id';
  let id = await AsyncStorage.getItem(KEY);
  if (!id) {
    id = 'anon_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
    await AsyncStorage.setItem(KEY, id);
  }
  return id;
}

export async function initAnalytics() {
  if (mp) return mp;

  const token = process.env.EXPO_PUBLIC_MIXPANEL_TOKEN;
  if (!token) {
    console.warn('Mixpanel: missing EXPO_PUBLIC_MIXPANEL_TOKEN');
    return null;
  }

  mp = new Mixpanel(token, /* trackAutomaticEvents */ true);
  await mp.init();

  const distinctId = await getDistinctId();
  await mp.identify(distinctId);

  // Super props básicos
  await mp.registerSuperProperties({
    app: 'BluEye',
    platform: 'android',
    build: 'dev', // cambia a 'production' en release si quieres
  });

  return mp;
}

export function track(event, props = {}) {
  if (!mp) return;
  mp.track(event, props);
}

export function timeEvent(event) {
  if (!mp) return;
  mp.timeEvent(event);
}

export function flush() {
  if (!mp) return;
  mp.flush();
}
