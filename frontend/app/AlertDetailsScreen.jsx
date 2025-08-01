import { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { colorForLevel } from '../components/AlertCard';

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
    <ScrollView className="flex-1">
      <View
        style={{ backgroundColor: colorForLevel(alert.level), height: 80 }}
        className="justify-center items-center"
      >
        <Text className="text-white font-bold text-lg text-center">
          {alert.title}
        </Text>
      </View>

      <View className="p-4">
        <Text className="text-base font-bold mb-2">Recomendaciones</Text>
        {alert.recommendations?.map((rec, idx) => (
          <Text key={idx} className="mb-1">
            • {rec}
          </Text>
        ))}

        <Text className="text-base font-bold mt-4 mb-2">Factores</Text>
        {alert.factors?.map((fac, idx) => (
          <Text key={idx} className="mb-1">
            • {fac}
          </Text>
        ))}
      </View>
    </ScrollView>
  );
}
