import { View, Text, Pressable, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import dayjs from "../utils/date";
import { useLocalSearchParams, useRouter } from "expo-router";

const colorForScore = (s) => {
  if (s <= 33) return "#4ade8033";
  if (s <= 66) return "#facc1533";
  return "#ef444433";
};

export default function AlertCard({ alert, onPress }) {
  const { id, level, title, short: description, timestamp } = alert;

  const router = useRouter();
  const { id: paramId } = useLocalSearchParams();

  const bannerColor = colorForScore(alert.score ?? 0);

  return (
    <Pressable
      className="w-full border-b border-b-gray-200 dark:border-b-gray-700 rounded-lg mb-2"
      style={{ backgroundColor: bannerColor }}
      android_ripple={{ color: "#ccc" }}
      onPress={onPress}
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
        <View className="space-y-2 w-2/6 h-24">
          <TouchableOpacity
            className="bg-phase2Buttons dark:bg-phase2ButtonsDark rounded-lg justify-center items-center h-10 ml-auto mb-2"
            onPress={() => router.push("/MapScreen")}
          >
            <Text className="text-white dark:text-phase2TitlesDark font-bold px-2">
              Ver en mapa
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-phase2Buttons dark:bg-phase2ButtonsDark rounded-lg justify-center items-center h-10 ml-auto"
            onPress={onPress}
          >
            <Text className="text-white dark:text-phase2TitlesDark font-bold px-2">
              Más detalles
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Pressable>
  );
}
