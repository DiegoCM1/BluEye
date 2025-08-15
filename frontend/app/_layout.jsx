import { Stack } from "expo-router";
// import { Drawer } from "expo-router/drawer";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { TamaguiProvider } from "@tamagui/core";
import config from "../tamagui.config";
import { ThemeProvider } from "../context/ThemeContext";
import { DaltonicModeProvider } from "../context/DaltonicModeContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useColorScheme } from "nativewind";
import { useEffect } from "react";
import { AppState } from "react-native";
import { useRouter } from "expo-router";
import {
  registerForPushNotificationsAsync,
  setForegroundNotificationHandler,
  addNotificationResponseListener,
} from "../utils/pushNotifications";
import * as Notifications from "expo-notifications";
import Toast from "react-native-toast-message";
import { initAnalytics, track, flush } from "../utils/analytics";
import { usePathname } from "expo-router";

/* ---------- Layout raíz ---------- */
export default function Layout() {
  const router = useRouter();

  const { colorScheme } = useColorScheme();

  useEffect(() => {
    initAnalytics().catch(console.error);
  }, []);

  // ⚡ Solicitar token FCM al montar
  useEffect(() => {
    registerForPushNotificationsAsync()
      .then((token) => {
        // Aquí podrías enviarlo a tu backend si quieres
        console.log("Token guardado:", token);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    setForegroundNotificationHandler();

    // 👇 Cuando el usuario pulse la notificación
    const sub = addNotificationResponseListener(async (data) => {
      if (data?.alertId) {
        await initAnalytics();
        track("push_open", {
          alertId: String(data.alertId),
          alertLevel: data.alertLevel ? Number(data.alertLevel) : undefined,
          origin: "listener",
        });
        router.push({
          pathname: "AlertDetailsScreen",
          params: { id: data.alertId },
        });
      }
    });

    return () => sub.remove(); // limpia al desmontar
  }, []);

  // Si la app se abrió tocando una notificación, esta llamada la devuelve
  useEffect(() => {
    (async () => {
      const initial = await Notifications.getLastNotificationResponseAsync();
      const alertId = initial?.notification?.request?.content?.data?.alertId;
      const alertLevel =
        initial?.notification?.request?.content?.data?.alertLevel;
      if (alertId) {
        await initAnalytics();
        track("push_open", {
          alertId: String(alertId),
          alertLevel: alertLevel ? Number(alertLevel) : undefined,
          origin: "initial",
        });
        router.push({
          pathname: "AlertDetailsScreen",
          params: { id: alertId },
        });
      }
    })();
  }, []);

  // Registra la pantalla actual en Mixpanel
  const pathname = usePathname();
  useEffect(() => {
    if (pathname) {
      (async () => {
        await initAnalytics();
        track("screen_view", { screen: pathname });
      })();
    }
  }, [pathname]);

  useEffect(() => {
    const sub = AppState.addEventListener("change", (state) => {
      if (state === "background") {
        track("app_background");
        flush();
      }
    });
    return () => sub.remove();
  }, []);

  const headerBg =
    colorScheme === "dark" ? "rgb(40, 60, 80)" : "rgb(60, 200, 220)";
  const headerTint = colorScheme === "dark" ? "rgb(230, 230, 250)" : "#fff";

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <DaltonicModeProvider>
        <ThemeProvider>
          <SafeAreaProvider>
            <TamaguiProvider config={config} defaultTheme="light">
              <SafeAreaView
                style={{ flex: 1, backgroundColor: headerBg }}
                edges={["top"]}
              >
                <Stack
                  screenOptions={{
                    headerStyle: { backgroundColor: headerBg },
                    headerTintColor: headerTint,
                    headerTitleStyle: { fontWeight: "bold" },
                  }}
                >
                  <Stack.Screen
                    name="(tabs)"
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="SettingsScreen"
                    options={{ title: "Ajustes" }}
                  />
                  <Stack.Screen
                    name="AlarmScreen"
                    options={{ title: "Alarma" }}
                  />
                  <Stack.Screen
                    name="FeedbackScreen"
                    options={{ title: "Feedback" }}
                  />
                  <Stack.Screen
                    name="AlertDetailsScreen"
                    options={{ title: "Detalles de Alerta" }}
                  />
                </Stack>
              </SafeAreaView>
              <Toast />
            </TamaguiProvider>
          </SafeAreaProvider>
        </ThemeProvider>
      </DaltonicModeProvider>
    </GestureHandlerRootView>
  );
}
