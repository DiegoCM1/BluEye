import { Pressable, Text } from 'react-native';
import dayjs from '../utils/date';

export const colorForLevel = (l) => ({
  1: '#4ade80',
  2: '#4ade80',
  3: '#facc15',
  4: '#f87171',
  5: '#ef4444',
}[l]);

export const bgForLevel = (l) => ({
  1: 'rgba(74,222,128,.15)',
  2: 'rgba(74,222,128,.15)',
  3: 'rgba(250,204,21,.15)',
  4: 'rgba(248,113,113,.15)',
  5: 'rgba(239,68,68,.15)',
}[l]);

export default function AlertCard({ alert, onPress }) {
  return (
    <Pressable
      className="p-4 mb-3 rounded-lg border"
      style={{
        borderColor: colorForLevel(alert.level),
        backgroundColor: bgForLevel(alert.level),
      }}
      onPress={onPress}
    >
      <Text className="font-bold text-base mb-1">{alert.title}</Text>
      <Text className="text-xs text-gray-700 dark:text-gray-300 mb-1">
        {alert.short}
      </Text>
      <Text className="text-[10px] text-gray-500 dark:text-gray-400">
        {dayjs(alert.timestamp).fromNow()}
      </Text>
    </Pressable>
  );
}
