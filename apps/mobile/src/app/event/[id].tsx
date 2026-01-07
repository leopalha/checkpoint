import {
  View,
  Text,
  ScrollView,
  Pressable,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import * as Location from 'expo-location';

import { api } from '../../services/api';
import { InteractionType } from '@checkpoint/types';

interface EventDetail {
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

const INTENTION_INFO: Record<InteractionType, { emoji: string; label: string }> = {
  fire: { emoji: '🔥', label: 'Paquera' },
  handshake: { emoji: '🤝', label: 'Networking' },
  highfive: { emoji: '✋', label: 'Amizade' },
  carona: { emoji: '🚗', label: 'Carona' },
  ticket: { emoji: '🎟️', label: 'Ingresso' },
  champagne: { emoji: '🍾', label: 'Rolê' },
  briefcase: { emoji: '💼', label: 'Negócios' },
  target: { emoji: '🎯', label: 'Objetivo' },
};

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [event, setEvent] = useState<EventDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedIntentions, setSelectedIntentions] = useState<InteractionType[]>([]);

  const fetchEvent = useCallback(async () => {
    try {
      const response = await api.get(`/events/${id}/details`);
      setEvent(response.data);
      if (response.data.userPresence?.intentions) {
        setSelectedIntentions(response.data.userPresence.intentions);
      }
    } catch (error) {
      console.error('Failed to fetch event:', error);
      Alert.alert('Erro', 'Não foi possível carregar o evento');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchEvent();
  }, [fetchEvent]);

  const toggleIntention = (type: InteractionType) => {
    if (event?.userPresence?.confirmed) return; // Can't change after confirmed
    setSelectedIntentions((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    );
  };

  const handleConfirmPresence = async () => {
    if (selectedIntentions.length === 0) {
      Alert.alert('Atenção', 'Selecione pelo menos uma intenção');
      return;
    }

    setActionLoading(true);
    try {
      await api.post('/presence/confirm', {
        eventId: id,
        intentions: selectedIntentions,
      });
      await fetchEvent();
      Alert.alert('Sucesso', 'Presença confirmada!');
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      Alert.alert('Erro', err.response?.data?.message || 'Não foi possível confirmar presença');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCheckIn = async () => {
    setActionLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Erro', 'Permissão de localização necessária para check-in');
        setActionLoading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      await api.post('/presence/check-in', {
        eventId: id,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      await fetchEvent();
      Alert.alert('Sucesso', 'Check-in realizado! Agora você pode interagir com outros participantes.');
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      Alert.alert('Erro', err.response?.data?.message || 'Não foi possível fazer check-in');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelPresence = async () => {
    Alert.alert(
      'Cancelar Presença',
      'Tem certeza que deseja cancelar sua presença neste evento?',
      [
        { text: 'Não', style: 'cancel' },
        {
          text: 'Sim, cancelar',
          style: 'destructive',
          onPress: async () => {
            setActionLoading(true);
            try {
              await api.delete(`/presence/${id}`);
              await fetchEvent();
            } catch (error: unknown) {
              const err = error as { response?: { data?: { message?: string } } };
              Alert.alert('Erro', err.response?.data?.message || 'Não foi possível cancelar');
            } finally {
              setActionLoading(false);
            }
          },
        },
      ],
    );
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#7C3AED" />
      </SafeAreaView>
    );
  }

  if (!event) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white">
        <Text className="text-gray-500">Evento não encontrado</Text>
      </SafeAreaView>
    );
  }

  const isConfirmed = event.userPresence?.confirmed;
  const isCheckedIn = event.userPresence?.checkedIn;
  const now = new Date();
  const eventStart = new Date(event.startDate);
  const eventEnd = new Date(event.endDate);
  const canCheckIn = isConfirmed && !isCheckedIn && now >= new Date(eventStart.getTime() - 30 * 60 * 1000) && now <= eventEnd;

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: '',
          headerTransparent: true,
          headerBackTitle: 'Voltar',
        }}
      />
      <ScrollView className="flex-1 bg-white">
        {/* Event Image */}
        {event.imageUrl ? (
          <Image source={{ uri: event.imageUrl }} className="h-64 w-full" resizeMode="cover" />
        ) : (
          <View className="h-64 bg-gray-200 items-center justify-center">
            <Text className="text-8xl">{THEME_EMOJIS[event.themeId] || '📅'}</Text>
          </View>
        )}

        <View className="px-6 py-6">
          {/* Status Badge */}
          {isCheckedIn && (
            <View className="bg-green-100 self-start px-3 py-1 rounded-full mb-3">
              <Text className="text-green-700 font-medium">Check-in realizado</Text>
            </View>
          )}
          {isConfirmed && !isCheckedIn && (
            <View className="bg-violet-100 self-start px-3 py-1 rounded-full mb-3">
              <Text className="text-violet-700 font-medium">Presença confirmada</Text>
            </View>
          )}

          {/* Event Info */}
          <Text className="text-2xl font-bold text-gray-900">{event.name}</Text>

          <View className="mt-4 gap-2">
            <View className="flex-row items-center">
              <Text className="text-xl mr-2">📅</Text>
              <Text className="text-gray-600">{formatDate(event.startDate)}</Text>
            </View>
            <View className="flex-row items-center">
              <Text className="text-xl mr-2">📍</Text>
              <View>
                <Text className="text-gray-900 font-medium">{event.locationName}</Text>
                <Text className="text-gray-500 text-sm">{event.locationAddress}</Text>
              </View>
            </View>
            {event.attendeeCount !== undefined && (
              <View className="flex-row items-center">
                <Text className="text-xl mr-2">👥</Text>
                <Text className="text-gray-600">{event.attendeeCount} confirmados</Text>
              </View>
            )}
          </View>

          {event.description && (
            <Text className="text-gray-600 mt-4 leading-6">{event.description}</Text>
          )}

          {/* Intentions Selection */}
          <View className="mt-6">
            <Text className="text-lg font-semibold text-gray-900 mb-2">
              {isConfirmed ? 'Suas intenções' : 'Selecione suas intenções'}
            </Text>
            <Text className="text-gray-500 text-sm mb-4">
              O que você busca neste evento?
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {event.allowedInteractions.map((type) => {
                const info = INTENTION_INFO[type as InteractionType];
                if (!info) return null;
                const isSelected = selectedIntentions.includes(type as InteractionType);
                return (
                  <Pressable
                    key={type}
                    className={`flex-row items-center px-4 py-2 rounded-full border-2 ${
                      isSelected
                        ? 'border-violet-600 bg-violet-50'
                        : 'border-gray-200 bg-white'
                    } ${isConfirmed ? 'opacity-70' : ''}`}
                    onPress={() => toggleIntention(type as InteractionType)}
                    disabled={isConfirmed}
                  >
                    <Text className="text-lg mr-1">{info.emoji}</Text>
                    <Text
                      className={isSelected ? 'text-violet-600 font-medium' : 'text-gray-700'}
                    >
                      {info.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Action Buttons */}
          <View className="mt-8 gap-3">
            {!isConfirmed && (
              <Pressable
                className={`py-4 rounded-2xl items-center ${
                  actionLoading ? 'bg-violet-400' : 'bg-violet-600'
                }`}
                onPress={handleConfirmPresence}
                disabled={actionLoading}
              >
                {actionLoading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white font-semibold text-lg">Confirmar Presença</Text>
                )}
              </Pressable>
            )}

            {canCheckIn && (
              <View className="gap-3">
                <Pressable
                  className={`py-4 rounded-2xl items-center ${
                    actionLoading ? 'bg-green-400' : 'bg-green-600'
                  }`}
                  onPress={handleCheckIn}
                  disabled={actionLoading}
                >
                  {actionLoading ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <View className="flex-row items-center">
                      <Text className="text-xl mr-2">📍</Text>
                      <Text className="text-white font-semibold text-lg">Check-in por GPS</Text>
                    </View>
                  )}
                </Pressable>
                <Pressable
                  className="py-4 rounded-2xl items-center border-2 border-violet-600 bg-white"
                  onPress={() => router.push(`/event/${id}/qr-checkin`)}
                  disabled={actionLoading}
                >
                  <View className="flex-row items-center">
                    <Text className="text-xl mr-2">📷</Text>
                    <Text className="text-violet-600 font-semibold text-lg">Check-in por QR Code</Text>
                  </View>
                </Pressable>
              </View>
            )}

            {isConfirmed && !isCheckedIn && !canCheckIn && (
              <View className="bg-gray-100 py-4 rounded-2xl items-center">
                <Text className="text-gray-500 font-medium">
                  Check-in disponível 30min antes do evento
                </Text>
              </View>
            )}

            {isCheckedIn && (
              <Pressable
                className="py-4 rounded-2xl items-center bg-violet-600"
                onPress={() => router.push(`/event/${id}/people`)}
              >
                <Text className="text-white font-semibold text-lg">Ver Participantes</Text>
              </Pressable>
            )}

            {isConfirmed && !isCheckedIn && (
              <Pressable
                className="py-3 items-center"
                onPress={handleCancelPresence}
                disabled={actionLoading}
              >
                <Text className="text-red-500 font-medium">Cancelar Presença</Text>
              </Pressable>
            )}
          </View>
        </View>
      </ScrollView>
    </>
  );
}
