import { View, Text, Pressable, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import dayjs from '../utils/date';

const bgForLevel = (l) => ({
  1: 'rgba(74,222,128,.15)', 2: 'rgba(74,222,128,.15)',
  3: 'rgba(250,204,21,.15)',
  4: 'rgba(248,113,113,.15)', 5: 'rgba(239,68,68,.15)',
}[l] ?? 'rgba(96,165,250,.15)');

export default function AlertCard({ alert, onPress }) {
  const { id, level, title, short: description, timestamp } = alert;

  return (
    <Pressable
      className="w-full border-b border-b-gray-200 dark:border-b-gray-700 rounded-lg mb-2"
      style={{ backgroundColor: bgForLevel(level) }}
      android_ripple={{ color: '#ccc' }}
      onPress={onPress}
    >
      {/* fila título + icono + tiempo */}
      <View className="flex-row items-center justify-between p-4">
        <MaterialCommunityIcons name="weather-hurricane" size={32} color="#38bdf8" />
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
            onPress={() => console.log('TODO: Ver en mapa', id)}
          >
            <Text className="text-white dark:text-phase2TitlesDark font-bold px-2">Ver en mapa</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            className="bg-phase2Buttons dark:bg-phase2ButtonsDark rounded-lg justify-center items-center h-10 ml-auto"
            onPress={onPress}
          >
            <Text className="text-white dark:text-phase2TitlesDark font-bold px-2">Más detalles</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Pressable>
  );
}
