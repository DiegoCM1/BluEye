// frontend/app/AlertDetailsScreen.jsx
import { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import dayjs from "../utils/date";

const API_URL = "https://metaquetzal-production.up.railway.app";

// helpers
const colorForScore = (s) => {
  if (s <= 33) return "#4ade80"; // green
  if (s <= 66) return "#facc15"; // yellow
  return "#ef4444"; // red
};

export default function AlertDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [alert, setAlert] = useState(null);
  const [loading, setLoad] = useState(true);
  const [error, setError] = useState(null);

  /* fetch */
  useEffect(() => {
    let live = true;
    (async () => {
      try {
        const res = await fetch(`${API_URL}/alerts/${id}`);
        if (!res.ok)
          throw Object.assign(new Error("Error"), { status: res.status });
        const data = await res.json();
        if (live) setAlert(data);
      } catch (e) {
        if (live) setError(e);
      } finally {
        if (live) setLoad(false);
      }
    })();
    return () => {
      live = false;
    };
  }, [id]);

  /* estados */
  if (loading)
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator />
      </View>
    );

  if (error)
    return (
      <View className="flex-1 justify-center items-center">
        <Text>
          {error.status === 404
            ? "Alerta no encontrada"
            : "Error al cargar alerta"}
        </Text>
      </View>
    );

  /* UI */
  const bannerColor = colorForScore(alert.score ?? 0);

  return (
    <View className="flex-1 bg-white dark:bg-neutral-900">
      {/* banner */}
      <View
        style={{ backgroundColor: bannerColor }}
        className="pt-10 pb-6 px-5 items-center"
      >
        <MaterialCommunityIcons
          name="weather-hurricane"
          size={42}
          color="#fff"
        />
        <Text className="text-white font-bold text-2xl text-center mt-2">
          {alert.title}
        </Text>
        <Text className="text-white text-sm mt-1">
          {dayjs(alert.timestamp).format("DD/MM/YYYY HH:mm")}
        </Text>
      </View>

      {/* contenido */}
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 20, gap: 18 }}
      >
        {/* descripción */}
        {alert.short && (
          <Text className="text-lg text-phase2SecondaryTxt dark:text-phase2SecondaryTxtDark">
            {alert.short}
          </Text>
        )}

        {/* métricas */}
        <View className="flex-row justify-around bg-neutral-100 dark:bg-neutral-800 rounded-xl p-4">
          <View className="items-center">
            <Text className="font-bold text-lg text-phase2Titles dark:text-phase2TitlesDark">
              {alert.level}
            </Text>
            <Text className="text-xs text-phase2SecondaryTxt dark:text-phase2SecondaryTxtDark">
              Nivel
            </Text>
          </View>
          <View className="items-center">
            <Text className="font-bold text-lg text-phase2Titles dark:text-phase2TitlesDark">
              {alert.score}
            </Text>
            <Text className="text-xs text-phase2SecondaryTxt dark:text-phase2SecondaryTxtDark">
              Score
            </Text>
          </View>
        </View>

        {/* recomendaciones */}
        {alert.recommendations?.length > 0 && (
          <View>
            <Text className="font-bold mb-2 dark:text-phase2TitlesDark">
              Recomendaciones
            </Text>
            {alert.recommendations.map((r, i) => (
              <Text
                key={i}
                className="mb-1 text-phase2SecondaryTxt dark:text-phase2SecondaryTxtDark"
              >
                • {r}
              </Text>
            ))}
          </View>
        )}

        {/* factores */}
        {alert.factors?.length > 0 && (
          <View>
            <Text className="font-bold mb-2 mt-2 dark:text-phase2TitlesDark">
              Factores
            </Text>
            {alert.factors.map((f, i) => (
              <Text
                key={i}
                className="mb-1 text-phase2SecondaryTxt dark:text-phase2SecondaryTxtDark"
              >
                • {f}
              </Text>
            ))}
            <Text className="mb-1 text-phase2SecondaryTxt dark:text-phase2SecondaryTxtDark">
              • Latitud
            </Text>
            <Text className="mb-1 text-phase2SecondaryTxt dark:text-phase2SecondaryTxtDark">
              • Altitud
            </Text>
            <Text className="mb-1 text-phase2SecondaryTxt dark:text-phase2SecondaryTxtDark">
              • Radio
            </Text>
            <Text className="mb-1 text-phase2SecondaryTxt dark:text-phase2SecondaryTxtDark">
              • Vientos
            </Text>
          </View>
        )}

        {/* id */}
        <Text className="text-xs text-neutral-500 dark:text-phase2SecondaryTxtDark mt-4">
          ID: {alert.id}
        </Text>
      </ScrollView>

      {/* acciones */}
      <View className="px-4 pb-6 flex-row justify-between gap-3">
        <TouchableOpacity
          className="flex-1 bg-phase2Buttons dark:bg-phase2ButtonsDark rounded-2xl py-3 items-center"
          onPress={() => router.push("/MapScreen")}
        >
          <Text className="text-white dark:text-phase2TitlesDark font-bold">
            Ver en mapa
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="flex-1 bg-phase2Buttons dark:bg-phase2ButtonsDark rounded-2xl py-3 items-center"
          onPress={() => console.log("TODO: Boletín oficial", id)}
        >
          <Text className="text-white dark:text-phase2TitlesDark font-bold">
            Ver Boletín oficial
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
