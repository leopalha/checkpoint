import { View, Text, Pressable, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface EventCardProps {
  id: string;
  name: string;
  imageUrl?: string | null;
  startDate: string;
  locationName: string;
  themeId?: string;
  attendeeCount?: number;
  distance?: number;
  isHappeningNow?: boolean;
  isConfirmed?: boolean;
  isCheckedIn?: boolean;
  onPress: () => void;
}

const THEME_COLORS: Record<string, [string, string]> = {
  romantic: ['#FF6B6B', '#FF85A1'],
  professional: ['#4A5568', '#2D3748'],
  social: ['#6366F1', '#8B5CF6'],
  party: ['#F59E0B', '#EF4444'],
  networking: ['#0D9488', '#059669'],
  fitness: ['#EF4444', '#F97316'],
  tech: ['#3B82F6', '#6366F1'],
  cultural: ['#8B5CF6', '#D946EF'],
  outdoor: ['#22C55E', '#16A34A'],
  custom: ['#7C3AED', '#D946EF'],
};

const THEME_EMOJIS: Record<string, string> = {
  romantic: '💕',
  professional: '💼',
  social: '🎉',
  party: '🪩',
  networking: '🤝',
  fitness: '💪',
  tech: '💻',
  cultural: '🎭',
  outdoor: '🏕️',
  custom: '✨',
};

function formatEventDate(startDate: string): string {
  const date = new Date(startDate);
  const day = date.getDate();
  const month = date.toLocaleString('pt-BR', { month: 'short' });
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${day} ${month} · ${hours}:${minutes}`;
}

export function EventCard({
  id,
  name,
  imageUrl,
  startDate,
  locationName,
  themeId = 'social',
  attendeeCount,
  distance,
  isHappeningNow,
  isConfirmed,
  isCheckedIn,
  onPress,
}: EventCardProps) {
  const colors = THEME_COLORS[themeId] || THEME_COLORS.custom;
  const emoji = THEME_EMOJIS[themeId] || '📅';

  return (
    <Pressable
      className="bg-white rounded-2xl overflow-hidden shadow-sm mb-4"
      onPress={onPress}
    >
      {/* Event Image/Header */}
      {imageUrl ? (
        <Image source={{ uri: imageUrl }} className="h-36 w-full" resizeMode="cover" />
      ) : (
        <LinearGradient
          colors={colors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="h-36 items-center justify-center"
        >
          <Text className="text-5xl">{emoji}</Text>
        </LinearGradient>
      )}

      {/* Live Badge */}
      {isHappeningNow && (
        <View className="absolute top-3 left-3 bg-red-500 px-3 py-1 rounded-full flex-row items-center">
          <View className="w-2 h-2 bg-white rounded-full mr-2" />
          <Text className="text-white text-xs font-bold">AO VIVO</Text>
        </View>
      )}

      {/* Event Info */}
      <View className="p-4">
        <Text className="text-lg font-bold text-gray-900" numberOfLines={2}>
          {name}
        </Text>

        <View className="flex-row items-center mt-2">
          <Text className="text-violet-600 font-medium">{formatEventDate(startDate)}</Text>
        </View>

        <View className="flex-row items-center mt-1">
          <Text className="text-gray-500">📍 {locationName}</Text>
        </View>

        {/* Stats Row */}
        <View className="flex-row items-center justify-between mt-4 pt-3 border-t border-gray-100">
          <View className="flex-row items-center gap-4">
            {attendeeCount !== undefined && (
              <View className="flex-row items-center">
                <Text className="text-base mr-1">👥</Text>
                <Text className="text-gray-600 font-medium">{attendeeCount}</Text>
              </View>
            )}
            {distance !== undefined && (
              <View className="flex-row items-center">
                <Text className="text-base mr-1">📍</Text>
                <Text className="text-gray-600 font-medium">
                  {distance < 1 ? `${Math.round(distance * 1000)}m` : `${distance.toFixed(1)}km`}
                </Text>
              </View>
            )}
          </View>

          {/* Status Badge */}
          {isCheckedIn ? (
            <View className="bg-green-100 px-3 py-1.5 rounded-full">
              <Text className="text-green-700 text-sm font-semibold">✓ Check-in</Text>
            </View>
          ) : isConfirmed ? (
            <View className="bg-violet-100 px-3 py-1.5 rounded-full">
              <Text className="text-violet-700 text-sm font-semibold">Confirmado</Text>
            </View>
          ) : (
            <LinearGradient
              colors={['#7C3AED', '#D946EF']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              className="px-4 py-2 rounded-full"
            >
              <Text className="text-white font-semibold">Ver</Text>
            </LinearGradient>
          )}
        </View>
      </View>
    </Pressable>
  );
}

export default EventCard;
