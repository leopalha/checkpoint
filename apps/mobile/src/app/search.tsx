import {
  View,
  Text,
  FlatList,
  Pressable,
  Image,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { useState, useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';

import { api } from '../services/api';

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

const THEMES = [
  { id: 'all', label: 'Todos', emoji: '🎯' },
  { id: 'social', label: 'Social', emoji: '🎉' },
  { id: 'party', label: 'Festa', emoji: '🪩' },
  { id: 'networking', label: 'Network', emoji: '🤝' },
  { id: 'romantic', label: 'Romance', emoji: '💕' },
  { id: 'tech', label: 'Tech', emoji: '💻' },
  { id: 'fitness', label: 'Fitness', emoji: '💪' },
  { id: 'cultural', label: 'Cultural', emoji: '🎭' },
  { id: 'outdoor', label: 'Outdoor', emoji: '🏕️' },
];

function formatEventDate(startDate: string): string {
  const date = new Date(startDate);
  const day = date.getDate();
  const month = date.toLocaleString('pt-BR', { month: 'short' });
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${day} ${month} · ${hours}:${minutes}`;
}

export default function SearchScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState('all');

  const searchEvents = useCallback(async (searchQuery: string, themeId?: string) => {
    if (!searchQuery.trim() && themeId === 'all') {
      setEvents([]);
      setSearched(false);
      return;
    }

    setLoading(true);
    setSearched(true);

    try {
      // Get user location for distance
      let latitude: number | undefined;
      let longitude: number | undefined;

      try {
        const { status } = await Location.getForegroundPermissionsAsync();
        if (status === 'granted') {
          const loc = await Location.getCurrentPositionAsync({});
          latitude = loc.coords.latitude;
          longitude = loc.coords.longitude;
        }
      } catch {
        // Location not available
      }

      const params: Record<string, unknown> = {
        q: searchQuery.trim() || '*',
        limit: 30,
      };

      if (themeId && themeId !== 'all') {
        params.themeId = themeId;
      }

      if (latitude && longitude) {
        params.latitude = latitude;
        params.longitude = longitude;
      }

      const response = await api.get('/events/search', { params });
      setEvents(response.data.events);
    } catch (error) {
      console.error('Failed to search events:', error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSearch = () => {
    searchEvents(query, selectedTheme);
  };

  const handleThemeChange = (themeId: string) => {
    setSelectedTheme(themeId);
    if (query.trim() || themeId !== 'all') {
      searchEvents(query, themeId);
    }
  };

  const navigateToEvent = (eventId: string) => {
    router.push(`/event/${eventId}`);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="px-4 py-3 bg-white border-b border-gray-100">
        <View className="flex-row items-center gap-3">
          <Pressable onPress={() => router.back()} className="p-2">
            <Text className="text-2xl">←</Text>
          </Pressable>
          <View className="flex-1 flex-row items-center bg-gray-100 rounded-xl px-4 py-3">
            <Text className="text-gray-400 mr-2">🔍</Text>
            <TextInput
              className="flex-1 text-base text-gray-900"
              placeholder="Buscar eventos..."
              placeholderTextColor="#9CA3AF"
              value={query}
              onChangeText={setQuery}
              onSubmitEditing={handleSearch}
              returnKeyType="search"
              autoFocus
            />
            {query.length > 0 && (
              <Pressable onPress={() => { setQuery(''); setEvents([]); setSearched(false); }}>
                <Text className="text-gray-400 text-lg">✕</Text>
              </Pressable>
            )}
          </View>
        </View>

        {/* Theme Filters */}
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={THEMES}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingVertical: 12, gap: 8 }}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => handleThemeChange(item.id)}
              className={`flex-row items-center px-4 py-2 rounded-full ${
                selectedTheme === item.id
                  ? 'bg-violet-600'
                  : 'bg-gray-100'
              }`}
            >
              <Text className="mr-1">{item.emoji}</Text>
              <Text
                className={`font-medium ${
                  selectedTheme === item.id ? 'text-white' : 'text-gray-700'
                }`}
              >
                {item.label}
              </Text>
            </Pressable>
          )}
        />
      </View>

      {/* Results */}
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#7C3AED" />
          <Text className="text-gray-500 mt-4">Buscando eventos...</Text>
        </View>
      ) : !searched ? (
        <View className="flex-1 items-center justify-center px-8">
          <Text className="text-6xl mb-4">🔍</Text>
          <Text className="text-gray-900 text-lg font-semibold text-center">
            Busque por eventos
          </Text>
          <Text className="text-gray-500 text-center mt-2">
            Digite o nome do evento, local ou escolha uma categoria acima
          </Text>
        </View>
      ) : events.length === 0 ? (
        <View className="flex-1 items-center justify-center px-8">
          <Text className="text-6xl mb-4">😕</Text>
          <Text className="text-gray-900 text-lg font-semibold text-center">
            Nenhum evento encontrado
          </Text>
          <Text className="text-gray-500 text-center mt-2">
            Tente buscar por outro termo ou categoria
          </Text>
        </View>
      ) : (
        <FlatList
          data={events}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16, gap: 12 }}
          renderItem={({ item }) => (
            <Pressable
              className="bg-white rounded-2xl p-4 shadow-sm flex-row"
              onPress={() => navigateToEvent(item.id)}
            >
              {/* Event Image */}
              {item.imageUrl ? (
                <Image
                  source={{ uri: item.imageUrl }}
                  className="w-20 h-20 rounded-xl"
                  resizeMode="cover"
                />
              ) : (
                <View className="w-20 h-20 bg-gray-200 rounded-xl items-center justify-center">
                  <Text className="text-3xl">{THEME_EMOJIS[item.themeId] || '📅'}</Text>
                </View>
              )}

              {/* Event Info */}
              <View className="flex-1 ml-4 justify-center">
                <Text className="text-base font-semibold text-gray-900" numberOfLines={1}>
                  {item.name}
                </Text>
                <Text className="text-gray-500 text-sm mt-1" numberOfLines={1}>
                  {formatEventDate(item.startDate)}
                </Text>
                <View className="flex-row items-center mt-1 gap-3">
                  <Text className="text-gray-500 text-sm" numberOfLines={1}>
                    📍 {item.locationName}
                  </Text>
                  {item.distance !== undefined && (
                    <Text className="text-gray-400 text-sm">
                      {item.distance < 1
                        ? `${Math.round(item.distance * 1000)}m`
                        : `${item.distance}km`}
                    </Text>
                  )}
                </View>
              </View>

              {/* Arrow */}
              <View className="justify-center">
                <Text className="text-gray-300 text-xl">›</Text>
              </View>
            </Pressable>
          )}
          ListFooterComponent={
            <Text className="text-center text-gray-400 py-4">
              {events.length} {events.length === 1 ? 'evento encontrado' : 'eventos encontrados'}
            </Text>
          }
        />
      )}
    </SafeAreaView>
  );
}
