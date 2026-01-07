import { View, Text, FlatList, Pressable, RefreshControl, Image, ScrollView } from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';
import { LinearGradient } from 'expo-linear-gradient';

import { api } from '../../services/api';
import { EmptyState, ErrorState, LoadingState } from '../../components';
import { useAuthStore } from '../../stores/authStore';

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

function isEventHappeningNow(startDate: string, endDate: string): boolean {
  const now = new Date();
  return new Date(startDate) <= now && new Date(endDate) >= now;
}

function isEventToday(startDate: string): boolean {
  const today = new Date();
  const eventDate = new Date(startDate);
  return (
    today.getDate() === eventDate.getDate() &&
    today.getMonth() === eventDate.getMonth() &&
    today.getFullYear() === eventDate.getFullYear()
  );
}

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'today' | 'confirmed'>('all');

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
            console.warn('Failed to get location:', locError);
            await fetchEvents();
          }
        } else {
          await fetchEvents();
        }
      } catch (permError) {
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

  // Filter events based on active filter
  const filteredEvents = events.filter((event) => {
    if (activeFilter === 'today') {
      return isEventToday(event.startDate);
    }
    if (activeFilter === 'confirmed') {
      return event.userPresence?.confirmed;
    }
    return true;
  });

  // Get happening now events
  const happeningNow = events.filter((e) => isEventHappeningNow(e.startDate, e.endDate));

  // Get first name for greeting
  const firstName = user?.name?.split(' ')[0] || 'Usuário';

  // Get time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  const renderHappeningNowCard = (event: Event) => {
    const colors = THEME_COLORS[event.themeId] || THEME_COLORS.custom;

    return (
      <Pressable
        key={event.id}
        onPress={() => navigateToEvent(event.id)}
        className="mr-4"
      >
        <LinearGradient
          colors={colors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="rounded-2xl p-4 w-72"
        >
          <View className="flex-row items-center justify-between">
            <View className="bg-white/20 px-3 py-1 rounded-full flex-row items-center">
              <View className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse" />
              <Text className="text-white text-sm font-medium">AO VIVO</Text>
            </View>
            <Text className="text-2xl">{THEME_EMOJIS[event.themeId] || '🎉'}</Text>
          </View>

          <Text className="text-white text-xl font-bold mt-3" numberOfLines={2}>
            {event.name}
          </Text>

          <Text className="text-white/80 mt-1" numberOfLines={1}>
            📍 {event.locationName}
          </Text>

          <View className="flex-row items-center justify-between mt-4">
            <View className="flex-row items-center">
              <View className="flex-row -space-x-2">
                {[1, 2, 3].map((i) => (
                  <View
                    key={i}
                    className="w-8 h-8 rounded-full bg-white/30 border-2 border-white/50"
                  />
                ))}
              </View>
              {event.attendeeCount && (
                <Text className="text-white ml-2 font-medium">
                  +{event.attendeeCount}
                </Text>
              )}
            </View>

            {event.userPresence?.checkedIn ? (
              <View className="bg-white/20 px-3 py-2 rounded-full">
                <Text className="text-white font-medium">✓ Check-in</Text>
              </View>
            ) : (
              <View className="bg-white px-4 py-2 rounded-full">
                <Text className="text-gray-900 font-semibold">Entrar</Text>
              </View>
            )}
          </View>
        </LinearGradient>
      </Pressable>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
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
          data={filteredEvents}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ flexGrow: 1 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#7C3AED']} />
          }
          ListHeaderComponent={
            <>
              {/* Header */}
              <View className="px-6 pt-4 pb-2 bg-white">
                <View className="flex-row items-center justify-between">
                  <View>
                    <Text className="text-gray-500 text-base">{getGreeting()},</Text>
                    <Text className="text-2xl font-bold text-gray-900">{firstName} 👋</Text>
                  </View>
                  <Pressable
                    onPress={() => router.push('/search')}
                    className="w-12 h-12 bg-gray-100 rounded-full items-center justify-center"
                  >
                    <Text className="text-xl">🔍</Text>
                  </Pressable>
                </View>
              </View>

              {/* Happening Now Section */}
              {happeningNow.length > 0 && (
                <View className="bg-white pb-4">
                  <Text className="px-6 text-lg font-bold text-gray-900 mb-3">
                    🔴 Acontecendo Agora
                  </Text>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 24 }}
                  >
                    {happeningNow.map(renderHappeningNowCard)}
                  </ScrollView>
                </View>
              )}

              {/* Filter Tabs */}
              <View className="flex-row px-6 py-4 bg-white border-b border-gray-100">
                {[
                  { key: 'all', label: 'Todos', emoji: '📅' },
                  { key: 'today', label: 'Hoje', emoji: '⚡' },
                  { key: 'confirmed', label: 'Confirmados', emoji: '✓' },
                ].map((filter) => (
                  <Pressable
                    key={filter.key}
                    className={`mr-3 px-4 py-2 rounded-full flex-row items-center ${
                      activeFilter === filter.key
                        ? 'bg-violet-600'
                        : 'bg-gray-100'
                    }`}
                    onPress={() => setActiveFilter(filter.key as typeof activeFilter)}
                  >
                    <Text className="mr-1">{filter.emoji}</Text>
                    <Text
                      className={`font-medium ${
                        activeFilter === filter.key ? 'text-white' : 'text-gray-600'
                      }`}
                    >
                      {filter.label}
                    </Text>
                  </Pressable>
                ))}
              </View>

              {/* Section Title */}
              <View className="px-6 pt-4 pb-2">
                <Text className="text-lg font-bold text-gray-900">
                  {activeFilter === 'all' && 'Próximos Eventos'}
                  {activeFilter === 'today' && 'Eventos de Hoje'}
                  {activeFilter === 'confirmed' && 'Seus Eventos'}
                </Text>
              </View>
            </>
          }
          renderItem={({ item }) => {
            const colors = THEME_COLORS[item.themeId] || THEME_COLORS.custom;
            const isHappening = isEventHappeningNow(item.startDate, item.endDate);

            return (
              <Pressable
                className="mx-6 mb-4 bg-white rounded-2xl overflow-hidden shadow-sm"
                onPress={() => navigateToEvent(item.id)}
              >
                {/* Event Image/Header */}
                {item.imageUrl ? (
                  <Image
                    source={{ uri: item.imageUrl }}
                    className="h-44 w-full"
                    resizeMode="cover"
                  />
                ) : (
                  <LinearGradient
                    colors={colors}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    className="h-44 items-center justify-center"
                  >
                    <Text className="text-6xl">{THEME_EMOJIS[item.themeId] || '📅'}</Text>
                  </LinearGradient>
                )}

                {/* Status Badge */}
                {isHappening && (
                  <View className="absolute top-4 left-4 bg-red-500 px-3 py-1 rounded-full flex-row items-center">
                    <View className="w-2 h-2 bg-white rounded-full mr-2" />
                    <Text className="text-white text-xs font-bold">AO VIVO</Text>
                  </View>
                )}

                {/* Event Info */}
                <View className="p-4">
                  <View className="flex-row items-start justify-between">
                    <View className="flex-1">
                      <Text className="text-xl font-bold text-gray-900" numberOfLines={2}>
                        {item.name}
                      </Text>
                      <View className="flex-row items-center mt-2">
                        <Text className="text-violet-600 font-medium">
                          {formatEventDate(item.startDate)}
                        </Text>
                      </View>
                      <View className="flex-row items-center mt-1">
                        <Text className="text-gray-500">📍 {item.locationName}</Text>
                      </View>
                    </View>
                  </View>

                  {/* Stats Row */}
                  <View className="flex-row items-center justify-between mt-4 pt-4 border-t border-gray-100">
                    <View className="flex-row items-center gap-4">
                      {item.attendeeCount !== undefined && (
                        <View className="flex-row items-center">
                          <Text className="text-lg mr-1">👥</Text>
                          <Text className="text-gray-600 font-medium">
                            {item.attendeeCount}
                          </Text>
                        </View>
                      )}
                      {item.distance !== undefined && (
                        <View className="flex-row items-center">
                          <Text className="text-lg mr-1">📍</Text>
                          <Text className="text-gray-600 font-medium">
                            {item.distance < 1
                              ? `${Math.round(item.distance * 1000)}m`
                              : `${item.distance.toFixed(1)}km`}
                          </Text>
                        </View>
                      )}
                    </View>

                    {/* Status Badge */}
                    {item.userPresence?.checkedIn ? (
                      <View className="bg-green-100 px-3 py-1.5 rounded-full">
                        <Text className="text-green-700 text-sm font-semibold">✓ Check-in</Text>
                      </View>
                    ) : item.userPresence?.confirmed ? (
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
                        <Text className="text-white font-semibold">Ver Evento</Text>
                      </LinearGradient>
                    )}
                  </View>
                </View>
              </Pressable>
            );
          }}
          ListEmptyComponent={
            <View className="px-6">
              <EmptyState
                emoji={activeFilter === 'confirmed' ? '🎫' : '📅'}
                title={
                  activeFilter === 'confirmed'
                    ? 'Nenhum evento confirmado'
                    : activeFilter === 'today'
                    ? 'Nenhum evento hoje'
                    : 'Nenhum evento próximo'
                }
                message={
                  activeFilter === 'confirmed'
                    ? 'Confirme presença em eventos para ver aqui.'
                    : 'Não encontramos eventos próximos. Tente buscar em outra localização.'
                }
                actionLabel="Buscar eventos"
                onAction={() => router.push('/search')}
              />
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}
