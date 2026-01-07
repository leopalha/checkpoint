import { View, Text, FlatList, Pressable, RefreshControl, Image } from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';

import { api } from '../../services/api';
import { EmptyState, ErrorState, LoadingState } from '../../components';

interface Event {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  startDate: string;
  endDate: string;
  locationName: string;
  locationAddress: string;
  latitude: number;
  longitude: number;
  themeId: string;
  allowedInteractions: string[];
  gpsRadius: number;
  distance?: number;
  attendeeCount?: number;
  userPresence?: {
    confirmed: boolean;
    checkedIn: boolean;
    intentions: string[];
  } | null;
}

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

export default function HomeScreen() {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  const fetchEvents = useCallback(async (lat?: number, lng?: number) => {
    try {
      setError(null);
      if (lat && lng) {
        const response = await api.get('/events/nearby', {
          params: { latitude: lat, longitude: lng, radius: 50 },
        });
        setEvents(response.data);
      } else {
        const response = await api.get('/events', {
          params: { filter: 'upcoming', limit: 20 },
        });
        setEvents(response.data.events);
      }
    } catch (err) {
      console.error('Failed to fetch events:', err);
      setError('Não foi possível carregar os eventos.');
    }
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          try {
            const loc = await Location.getCurrentPositionAsync({
              accuracy: Location.Accuracy.Balanced,
            });
            setLocation({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });
            await fetchEvents(loc.coords.latitude, loc.coords.longitude);
          } catch (locError) {
            // Location fetch failed, fall back to showing all events
            console.warn('Failed to get location:', locError);
            await fetchEvents();
          }
        } else {
          await fetchEvents();
        }
      } catch (permError) {
        // Permission request failed, fall back to showing all events
        console.warn('Location permission error:', permError);
        await fetchEvents();
      } finally {
        setLoading(false);
      }
    })();
  }, [fetchEvents]);

  const onRefresh = async () => {
    setRefreshing(true);
    if (location) {
      await fetchEvents(location.latitude, location.longitude);
    } else {
      await fetchEvents();
    }
    setRefreshing(false);
  };

  const navigateToEvent = (eventId: string) => {
    router.push(`/event/${eventId}`);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="px-6 py-4 bg-white border-b border-gray-100">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-2xl font-bold text-gray-900">Eventos</Text>
            <Pressable className="flex-row items-center mt-1">
              <Text className="text-gray-500">📍 São Paulo, SP</Text>
              <Text className="text-gray-400 ml-1">▼</Text>
            </Pressable>
          </View>
          <Pressable
            onPress={() => router.push('/search')}
            className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center"
          >
            <Text className="text-lg">🔍</Text>
          </Pressable>
        </View>
      </View>

      {/* Events List */}
      {loading ? (
        <LoadingState message="Carregando eventos..." />
      ) : error ? (
        <ErrorState
          message={error}
          onRetry={() => {
            setLoading(true);
            if (location) {
              fetchEvents(location.latitude, location.longitude).finally(() => setLoading(false));
            } else {
              fetchEvents().finally(() => setLoading(false));
            }
          }}
        />
      ) : (
        <FlatList
          data={events}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16, gap: 16 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#7C3AED']} />
          }
          renderItem={({ item }) => (
            <Pressable
              className="bg-white rounded-2xl p-4 shadow-sm"
              onPress={() => navigateToEvent(item.id)}
            >
              {/* Event Image */}
              {item.imageUrl ? (
                <Image
                  source={{ uri: item.imageUrl }}
                  className="h-40 rounded-xl mb-4"
                  resizeMode="cover"
                />
              ) : (
                <View className="h-40 bg-gray-200 rounded-xl items-center justify-center mb-4">
                  <Text className="text-6xl">{THEME_EMOJIS[item.themeId] || '📅'}</Text>
                </View>
              )}

              {/* Event Info */}
              <View className="flex-row items-start justify-between">
                <View className="flex-1">
                  <Text className="text-lg font-semibold text-gray-900">
                    {item.name}
                  </Text>
                  <Text className="text-gray-500 mt-1">
                    {formatEventDate(item.startDate)} · {item.locationName}
                  </Text>
                </View>
                {item.userPresence?.checkedIn && (
                  <View className="bg-green-100 px-2 py-1 rounded-full">
                    <Text className="text-green-700 text-xs font-medium">Check-in</Text>
                  </View>
                )}
                {item.userPresence?.confirmed && !item.userPresence.checkedIn && (
                  <View className="bg-violet-100 px-2 py-1 rounded-full">
                    <Text className="text-violet-700 text-xs font-medium">Confirmado</Text>
                  </View>
                )}
              </View>

              {/* Stats */}
              <View className="flex-row mt-3 gap-4">
                {item.attendeeCount !== undefined && (
                  <Text className="text-gray-500">
                    👥 {item.attendeeCount} confirmados
                  </Text>
                )}
                {item.distance !== undefined && (
                  <Text className="text-gray-500">
                    📍 {item.distance < 1 ? `${Math.round(item.distance * 1000)}m` : `${item.distance}km`}
                  </Text>
                )}
              </View>
            </Pressable>
          )}
          ListEmptyComponent={
            <EmptyState
              emoji="📅"
              title="Nenhum evento próximo"
              message="Não encontramos eventos próximos a você. Tente buscar em outra localização ou aguarde novos eventos."
              actionLabel="Buscar eventos"
              onAction={() => router.push('/search')}
            />
          }
        />
      )}
    </SafeAreaView>
  );
}
