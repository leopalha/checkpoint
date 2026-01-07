import { View, Text, Pressable, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface MatchCardProps {
  id: string;
  user: {
    id: string;
    name: string;
    profilePicture?: string | null;
  };
  eventName: string;
  interactionType: string;
  lastMessage?: {
    content: string;
    createdAt: string;
    isOwn: boolean;
  } | null;
  unreadCount?: number;
  expiresAt?: string;
  onPress: () => void;
}

const INTERACTION_EMOJIS: Record<string, string> = {
  fire: '🔥',
  handshake: '🤝',
  highfive: '✋',
  carona: '🚗',
  ticket: '🎫',
  champagne: '🍾',
  briefcase: '💼',
  target: '🎯',
};

function formatTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  } else if (diffDays === 1) {
    return 'Ontem';
  } else if (diffDays < 7) {
    return date.toLocaleDateString('pt-BR', { weekday: 'short' });
  } else {
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  }
}

function getDaysRemaining(expiresAt: string): number {
  const expires = new Date(expiresAt);
  const now = new Date();
  const diffMs = expires.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
}

export function MatchCard({
  id,
  user,
  eventName,
  interactionType,
  lastMessage,
  unreadCount = 0,
  expiresAt,
  onPress,
}: MatchCardProps) {
  const daysRemaining = expiresAt ? getDaysRemaining(expiresAt) : null;
  const isExpiringSoon = daysRemaining !== null && daysRemaining <= 2;

  return (
    <Pressable
      className="bg-white rounded-2xl p-4 mb-3 flex-row items-center shadow-sm"
      onPress={onPress}
    >
      {/* Avatar with interaction badge */}
      <View className="relative mr-4">
        {user.profilePicture ? (
          <Image
            source={{ uri: user.profilePicture }}
            className="w-16 h-16 rounded-full"
          />
        ) : (
          <LinearGradient
            colors={['#7C3AED', '#D946EF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="w-16 h-16 rounded-full items-center justify-center"
          >
            <Text className="text-white text-2xl font-bold">
              {user.name.charAt(0).toUpperCase()}
            </Text>
          </LinearGradient>
        )}

        {/* Interaction type badge */}
        <View className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-sm">
          <Text className="text-lg">{INTERACTION_EMOJIS[interactionType] || '💜'}</Text>
        </View>
      </View>

      {/* Content */}
      <View className="flex-1">
        <View className="flex-row items-center justify-between">
          <Text className="text-lg font-semibold text-gray-900" numberOfLines={1}>
            {user.name}
          </Text>
          {lastMessage && (
            <Text className="text-xs text-gray-400">
              {formatTime(lastMessage.createdAt)}
            </Text>
          )}
        </View>

        <Text className="text-violet-600 text-sm" numberOfLines={1}>
          📍 {eventName}
        </Text>

        {lastMessage ? (
          <Text
            className={`text-sm mt-1 ${unreadCount > 0 ? 'text-gray-900 font-medium' : 'text-gray-500'}`}
            numberOfLines={1}
          >
            {lastMessage.isOwn ? 'Voce: ' : ''}{lastMessage.content}
          </Text>
        ) : (
          <Text className="text-gray-400 text-sm mt-1 italic">
            Envie a primeira mensagem!
          </Text>
        )}

        {/* Expiring warning */}
        {isExpiringSoon && (
          <View className="flex-row items-center mt-2">
            <Text className="text-amber-500 text-xs">
              ⏰ Expira em {daysRemaining} {daysRemaining === 1 ? 'dia' : 'dias'}
            </Text>
          </View>
        )}
      </View>

      {/* Unread badge */}
      {unreadCount > 0 && (
        <View className="ml-2">
          <LinearGradient
            colors={['#7C3AED', '#D946EF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="min-w-[24px] h-6 rounded-full items-center justify-center px-2"
          >
            <Text className="text-white text-xs font-bold">
              {unreadCount > 99 ? '99+' : unreadCount}
            </Text>
          </LinearGradient>
        </View>
      )}
    </Pressable>
  );
}

export default MatchCard;
