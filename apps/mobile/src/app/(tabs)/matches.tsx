import { View, Text, FlatList, Pressable, Image, RefreshControl, ActivityIndicator, Alert } from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, useRouter } from 'expo-router';

import { api } from '../../services/api';
import { useChat } from '../../hooks/useChat';

interface Match {
  id: string;
  eventId: string;
  interactionType: string;
  status: 'pending' | 'revealed' | 'expired';
  revealedAt: string | null;
  expiresAt: string | null;
  createdAt: string;
  otherUser: {
    id: string;
    name: string;
    instagramUsername: string;
    profilePicture: string | null;
    bio: string | null;
  };
  event: {
    id: string;
    name: string;
    locationName: string;
  };
  canChat: boolean;
  unreadCount?: number;
}

const INTERACTION_EMOJIS: Record<string, string> = {
  fire: '🔥',
  handshake: '🤝',
  highfive: '✋',
  carona: '🚗',
  ticket: '🎟️',
  champagne: '🍾',
  briefcase: '💼',
  target: '🎯',
};

function formatTimeAgo(date: string): string {
  const now = new Date();
  const then = new Date(date);
  const diffMs = now.getTime() - then.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 0) return `${diffDays}d atrás`;
  if (diffHours > 0) return `${diffHours}h atrás`;
  return 'Agora';
}

export default function MatchesScreen() {
  const router = useRouter();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'revealed'>('all');

  const fetchMatches = useCallback(async () => {
    try {
      const params = filter !== 'all' ? { status: filter } : {};
      const response = await api.get('/matches', { params });
      setMatches(response.data);
    } catch (error) {
      console.error('Failed to fetch matches:', error);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  // Real-time match updates via WebSocket
  useChat({
    onMatchRevealed: (data) => {
      // Refresh matches list when a new match is revealed
      fetchMatches();
      // Show alert for new match
      Alert.alert(
        'Novo Match!',
        `Você deu match com ${data.otherUser.name} no evento ${data.eventName}!`,
        [
          {
            text: 'Ver Match',
            onPress: () => router.push(`/chat/${data.matchId}`),
          },
          { text: 'Fechar', style: 'cancel' },
        ]
      );
    },
    onUnreadUpdate: () => {
      // Refresh to update unread counts
      fetchMatches();
    },
  });

  useEffect(() => {
    fetchMatches();
  }, [fetchMatches]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchMatches();
    setRefreshing(false);
  };

  const handleMatchPress = (match: Match) => {
    if (match.status === 'revealed' && match.canChat) {
      router.push(`/chat/${match.id}`);
    } else if (match.status === 'pending') {
      router.push(`/event/${match.eventId}`);
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" color="#7C3AED" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="px-6 py-4 bg-white border-b border-gray-100">
        <Text className="text-2xl font-bold text-gray-900">Matches</Text>

        {/* Filter Tabs */}
        <View className="flex-row mt-3 gap-2">
          {(['all', 'pending', 'revealed'] as const).map((f) => (
            <Pressable
              key={f}
              className={`px-4 py-2 rounded-full ${
                filter === f ? 'bg-violet-600' : 'bg-gray-100'
              }`}
              onPress={() => setFilter(f)}
            >
              <Text
                className={`font-medium ${
                  filter === f ? 'text-white' : 'text-gray-600'
                }`}
              >
                {f === 'all' ? 'Todos' : f === 'pending' ? 'Pendentes' : 'Revelados'}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Matches List */}
      <FlatList
        data={matches}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, gap: 12, flexGrow: 1 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#7C3AED']} />
        }
        renderItem={({ item }) => (
          <Pressable
            className="bg-white rounded-2xl p-4 shadow-sm flex-row items-center"
            onPress={() => handleMatchPress(item)}
          >
            {/* Profile Picture */}
            {item.status === 'revealed' ? (
              item.otherUser.profilePicture ? (
                <Image
                  source={{ uri: item.otherUser.profilePicture }}
                  className="w-16 h-16 rounded-full"
                />
              ) : (
                <View className="w-16 h-16 rounded-full bg-gray-200 items-center justify-center">
                  <Text className="text-2xl">👤</Text>
                </View>
              )
            ) : (
              <View className="w-16 h-16 rounded-full bg-violet-100 items-center justify-center">
                <Text className="text-2xl">❓</Text>
              </View>
            )}

            {/* Match Info */}
            <View className="flex-1 ml-4">
              {item.status === 'revealed' ? (
                <>
                  <Text className="text-lg font-semibold text-gray-900">
                    {item.otherUser.name}
                  </Text>
                  <Text className="text-gray-500">@{item.otherUser.instagramUsername}</Text>
                </>
              ) : (
                <>
                  <Text className="text-lg font-semibold text-gray-900">
                    Match Pendente
                  </Text>
                  <Text className="text-gray-500">Faça check-in para revelar</Text>
                </>
              )}

              <View className="flex-row items-center mt-1 gap-2">
                <Text className="text-lg">{INTERACTION_EMOJIS[item.interactionType] || '💜'}</Text>
                <Text className="text-gray-400 text-sm">{item.event.name}</Text>
              </View>
            </View>

            {/* Status/Action */}
            <View className="items-end">
              {item.status === 'revealed' && item.canChat ? (
                <>
                  {(item.unreadCount ?? 0) > 0 && (
                    <View className="bg-violet-600 w-6 h-6 rounded-full items-center justify-center mb-1">
                      <Text className="text-white text-xs font-bold">{item.unreadCount}</Text>
                    </View>
                  )}
                  <Text className="text-gray-400 text-sm">{formatTimeAgo(item.createdAt)}</Text>
                </>
              ) : item.status === 'pending' ? (
                <View className="bg-orange-100 px-3 py-1 rounded-full">
                  <Text className="text-orange-700 text-sm font-medium">Pendente</Text>
                </View>
              ) : (
                <View className="bg-gray-100 px-3 py-1 rounded-full">
                  <Text className="text-gray-500 text-sm font-medium">Expirado</Text>
                </View>
              )}
            </View>
          </Pressable>
        )}
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center py-20">
            <Text className="text-6xl mb-4">💜</Text>
            <Text className="text-xl font-semibold text-gray-900 mb-2">
              {filter === 'all' ? 'Nenhum match ainda!' : `Nenhum match ${filter === 'pending' ? 'pendente' : 'revelado'}`}
            </Text>
            <Text className="text-gray-500 text-center px-8 mb-6">
              Confirme presença em eventos e interaja com pessoas para criar matches.
              {'\n\n'}
              O match só é revelado quando AMBOS fazem check-in!
            </Text>
            <Link href="/(tabs)/home" asChild>
              <Pressable className="bg-violet-600 px-6 py-3 rounded-full">
                <Text className="text-white font-medium">Ver eventos próximos</Text>
              </Pressable>
            </Link>
          </View>
        }
      />
    </SafeAreaView>
  );
}
