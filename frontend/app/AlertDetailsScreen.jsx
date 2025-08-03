import { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import dayjs from '../utils/date';

// Color helper matching the one used in AlertCard
const colorForLevel = (l) => ({
  1: '#4ade80',
  2: '#4ade80',
  3: '#facc15',
  4: '#f87171',
  5: '#ef4444',
}[l] ?? '#60a5fa');

const API_URL = 'https://metaquetzal-production.up.railway.app';

export default function AlertDetailsScreen() {
  const { id } = useLocalSearchParams();
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    fetch(`${API_URL}/alerts/${id}`)
      .then(async (res) => {
        if (!res.ok) {
          const err = new Error('Error');
          err.status = res.status;
          throw err;
        }
        return res.json();
      })
      .then((data) => {
        if (isMounted) setAlert(data);
      })
      .catch((e) => {
        if (isMounted) setError(e);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator />
      </View>
    );
  }

  if (error) {
    if (error.status === 404) {
      return (
        <View className="flex-1 justify-center items-center">
          <Text>Alerta no encontrada</Text>
        </View>
      );
    }
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Error al cargar alerta</Text>
      </View>
    );
  }

  if (!alert) {
    return null;
  }

  return (
    <ScrollView className="flex-1 bg-white dark:bg-neutral-900">
      {/* encabezado coloreado */}
      <View
        style={{ backgroundColor: colorForLevel(alert.level) }}
        className="p-4 justify-center items-center"
      >
        <Text className="text-white font-bold text-xl text-center">
          {alert.title}
        </Text>
        <Text className="text-white text-sm mt-1">
          {dayjs(alert.timestamp).format('DD/MM/YYYY HH:mm')}
        </Text>
      </View>

      <View className="p-4 space-y-4">
        {/* descripción corta */}
        <Text className="text-base text-phase2SecondaryTxt dark:text-phase2SecondaryTxtDark">
          {alert.short}
        </Text>

        {/* nivel y puntaje */}
        <View className="flex-row justify-between">
          <Text className="font-bold text-phase2SecondaryTxt dark:text-phase2SecondaryTxtDark">
            Nivel: {alert.level}
          </Text>
          <Text className="font-bold text-phase2SecondaryTxt dark:text-phase2SecondaryTxtDark">
            Puntaje: {alert.score}
          </Text>
        </View>

        {/* recomendaciones */}
        <View>
          <Text className="text-base font-bold mb-2 dark:text-phase2TitlesDark">
            Recomendaciones
          </Text>
          {alert.recommendations?.map((rec, idx) => (
            <Text
              key={idx}
              className="mb-1 text-phase2SecondaryTxt dark:text-phase2SecondaryTxtDark"
            >
              • {rec}
            </Text>
          ))}
        </View>

        {/* factores */}
        <View>
          <Text className="text-base font-bold mb-2 mt-2 dark:text-phase2TitlesDark">
            Factores
          </Text>
          {alert.factors?.map((fac, idx) => (
            <Text
              key={idx}
              className="mb-1 text-phase2SecondaryTxt dark:text-phase2SecondaryTxtDark"
            >
              • {fac}
            </Text>
          ))}
        </View>

        {/* id al final */}
        <Text className="text-xs text-phase2SecondaryTxt dark:text-phase2SecondaryTxtDark mt-4">
          ID: {alert.id}
        </Text>
      </View>
    </ScrollView>
  );
}
