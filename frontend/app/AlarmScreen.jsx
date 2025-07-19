import { useState, useEffect } from "react";
import { Modal, View, Text, TouchableOpacity } from "react-native";
import { Link, useRouter, useLocalSearchParams } from "expo-router";
import { getAlertSummary } from "../api/alerts";

const CATEGORY_BG = {
  3: "bg-phase3bg dark:bg-phase2CardsDark",
  4: "bg-phase4bg dark:bg-phase2CardsDark",
  5: "bg-phase5bg dark:bg-phase2CardsDark",
};

export default function AlarmScreen() {
  const params = useLocalSearchParams();
  const alertId = params.id;
  const [alert, setAlert] = useState(null);
  const [visible, setVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      if (alertId) {
        try {
          const data = await getAlertSummary(alertId);
          setAlert(data);
        } catch (e) {
          console.error("Failed to fetch alert", e);
        }
      }
    };
    fetchData();
    const t = setTimeout(() => setVisible(true), 250);
    return () => clearTimeout(t);
  }, [alertId]);
  const handleMap = () => {
    setVisible(false);
    router.push("/MapScreen");
  };
  const handleClose = () => setVisible(false);

  return (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={handleClose}>
      <View className="flex-1 justify-center items-center bg-black/70">
        <View
          className={`w-11/12 max-w-md rounded-2xl p-6 shadow-xl ${
            CATEGORY_BG[alert?.category || 3]
          }`}
        >
          {/* Título */}
          <Text className="text-2xl font-extrabold text-phase2Titles dark:text-phase2TitlesDark text-center mb-4">
            {alert?.title}
          </Text>

          {/* Mensaje breve */}
          <Text className="text-base text-phase2Titles dark:text-phase2TitlesDark text-center mb-6">
            {alert?.message}
          </Text>



          {/* Botones */}
          <View className="flex-row justify-between mb-6">
            <TouchableOpacity
              onPress={handleMap}
              className="flex-1 mr-2 py-3 rounded-lg bg-phase2Buttons dark:bg-phase2ButtonsDark items-center"
              >
              <Text className="font-bold text-white">Ver en el mapa</Text>
              </TouchableOpacity>

            <Link
              href={{ pathname: "/AlertDetailsScreen", params: { id: alertId } }}
              asChild
            >
              <TouchableOpacity className="flex-1 ml-2 py-3 rounded-lg bg-phase2Buttons dark:bg-phase2ButtonsDark items-center">
                <Text className="font-bold text-white">Más información</Text>
              </TouchableOpacity>
            </Link>
          </View>

          {/* Cerrar */}
          <TouchableOpacity onPress={handleClose} className="py-2 rounded-lg bg-phase2Buttons dark:bg-phase2ButtonsDark items-center">
            <Text className="font-bold text-white">Cerrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

