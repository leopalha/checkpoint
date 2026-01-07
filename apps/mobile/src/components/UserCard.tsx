import { View, Text, Pressable, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface UserCardProps {
  id: string;
  name: string;
  profilePicture?: string | null;
  bio?: string | null;
  intentions?: string[];
  status?: string | null;
  isLiked?: boolean;
  onPress: () => void;
  onLike?: () => void;
}

const INTENTION_EMOJIS: Record<string, string> = {
  fire: '🔥',
  handshake: '🤝',
  highfive: '✋',
  carona: '🚗',
  ticket: '🎫',
  champagne: '🍾',
  briefcase: '💼',
  target: '🎯',
};

export function UserCard({
  id,
  name,
  profilePicture,
  bio,
  intentions = [],
  status,
  isLiked,
  onPress,
  onLike,
}: UserCardProps) {
  return (
    <Pressable
      className="bg-white rounded-2xl p-4 mb-3 flex-row items-center shadow-sm"
      onPress={onPress}
    >
      {/* Avatar */}
      {profilePicture ? (
        <Image
          source={{ uri: profilePicture }}
          className="w-16 h-16 rounded-full mr-4"
        />
      ) : (
        <View className="w-16 h-16 rounded-full bg-violet-100 items-center justify-center mr-4">
          <Text className="text-2xl">{name.charAt(0).toUpperCase()}</Text>
        </View>
      )}

      {/* Info */}
      <View className="flex-1">
        <Text className="text-lg font-semibold text-gray-900">{name}</Text>

        {/* Intentions */}
        {intentions.length > 0 && (
          <View className="flex-row mt-1">
            {intentions.slice(0, 4).map((intention, index) => (
              <Text key={index} className="mr-1">
                {INTENTION_EMOJIS[intention] || '✨'}
              </Text>
            ))}
          </View>
        )}

        {/* Status */}
        {status && (
          <Text className="text-gray-500 text-sm mt-1" numberOfLines={1}>
            {status}
          </Text>
        )}
      </View>

      {/* Like Button */}
      {onLike && (
        <Pressable
          onPress={(e) => {
            e.stopPropagation();
            onLike();
          }}
          className="ml-2"
        >
          {isLiked ? (
            <View className="w-12 h-12 rounded-full bg-violet-100 items-center justify-center">
              <Text className="text-2xl">💜</Text>
            </View>
          ) : (
            <LinearGradient
              colors={['#7C3AED', '#D946EF']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="w-12 h-12 rounded-full items-center justify-center"
            >
              <Text className="text-2xl">🤍</Text>
            </LinearGradient>
          )}
        </Pressable>
      )}
    </Pressable>
  );
}

export default UserCard;
