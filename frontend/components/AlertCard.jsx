import { View, Text, Pressable, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import dayjs from "../utils/date";
import { useLocalSearchParams, useRouter } from "expo-router";
import { track } from '../utils/analytics';

export const colorForLevel = (l) =>
  ({
    1: "#3B82F6", // azul
    2: "#22C55E", // verde
    3: "#FACC15", // amarillo
    4: "#FB923C", // naranja
    5: "#EF4444", // rojo
  }[l]);

export default function AlertCard({ alert, onPress }) {
  const { id, level, title, short: description, timestamp } = alert;

  const router = useRouter();
  const { id: paramId } = useLocalSearchParams();

  const bannerColor = `${colorForLevel(level)}33`;

  return (
    <Pressable
      className="w-full border-b border-b-gray-200 dark:border-b-gray-700 rounded-lg mb-2"
      style={{ backgroundColor: bannerColor }}
      android_ripple={{ color: "#ccc" }}
        onPress={() => {
         track('alert_card_tap', {
           alertId: String(alert.id),
           level: Number(alert.level),
           score: Number(alert.score ?? 0),
         });
          onPress?.();
        }}
    >
      {/* fila título + icono + tiempo */}
      <View className="flex-row items-center justify-between p-4">
        <MaterialCommunityIcons
          name="weather-hurricane"
          size={32}
          color="#38bdf8"
        />
        <Text className="flex-1 text-xl font-bold ml-2 dark:text-phase2TitlesDark">
          {title}
        </Text>
        <Text className="text-base text-right text-phase2SecondaryTxt dark:text-phase2SecondaryTxtDark">
          {dayjs(timestamp).fromNow()}
        </Text>
      </View>

      {/* descripción + botones */}
      <View className="flex-row items-start px-4 pb-2">
        <Text className="text-base w-4/6 text-phase2SecondaryTxt dark:text-phase2SecondaryTxtDark pr-2">
          {description}
        </Text>
        <View className="space-y-2 w-2/6 h-20">
          <TouchableOpacity
            className="bg-phase2Buttons dark:bg-phase2CardsDark rounded-lg justify-center items-center h-10 ml-auto mb-2"
            android_ripple={{ color: "#ffffff33" }}
            onPress={() => router.push("/MapScreen")}
          >
            <Text className="text-white dark:text-phase2TitlesDark font-bold px-2">
              Ver en mapa
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Pressable>
  );
}
