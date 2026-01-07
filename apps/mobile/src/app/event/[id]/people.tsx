import {
  View,
  Text,
  FlatList,
  Pressable,
  Image,
  ActivityIndicator,
  Alert,
  Modal,
} from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, Stack } from 'expo-router';

import { api } from '../../../services/api';
import { InteractionType } from '@checkpoint/types';

interface UserAtEvent {
  id: string;
  name: string;
  instagramUsername: string;
  profilePicture: string | null;
  bio: string | null;
  intentions: string[];
  alreadyInteracted: boolean;
  interactionType?: string;
}

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

export default function PeopleAtEventScreen() {
  const { id: eventId } = useLocalSearchParams<{ id: string }>();

  const [users, setUsers] = useState<UserAtEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<{ sent: number; received: number; remaining: number } | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserAtEvent | null>(null);
  const [showInteractionModal, setShowInteractionModal] = useState(false);
  const [sendingInteraction, setSendingInteraction] = useState(false);
  const [matchAnimation, setMatchAnimation] = useState<{ show: boolean; userName: string }>({
    show: false,
    userName: '',
  });

  const fetchData = useCallback(async () => {
    try {
      const [usersRes, statsRes] = await Promise.all([
        api.get(`/interactions/event/${eventId}/users`),
        api.get('/interactions/stats', { params: { eventId } }),
      ]);
      setUsers(usersRes.data);
      setStats(statsRes.data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSelectUser = (user: UserAtEvent) => {
    if (user.alreadyInteracted) {
      Alert.alert('Já interagiu', `Você já enviou ${INTENTION_INFO[user.interactionType as InteractionType]?.emoji || ''} para ${user.name}`);
      return;
    }

    // Check daily limit
    if (stats && stats.remaining === 0) {
      Alert.alert(
        'Limite Diário Atingido',
        'Você atingiu o limite de 10 interações gratuitas por dia. Assine o Premium para interações ilimitadas!',
        [
          { text: 'Entendi', style: 'cancel' },
          { text: 'Ver Premium', onPress: () => { /* Navigate to premium */ } },
        ]
      );
      return;
    }

    setSelectedUser(user);
    setShowInteractionModal(true);
  };

  const handleSendInteraction = async (type: InteractionType) => {
    if (!selectedUser) return;

    setSendingInteraction(true);
    try {
      const response = await api.post('/interactions', {
        toUserId: selectedUser.id,
        eventId,
        type,
      });

      setShowInteractionModal(false);

      if (response.data.matchCreated) {
        // Show match animation
        setMatchAnimation({ show: true, userName: selectedUser.name });
        setTimeout(() => setMatchAnimation({ show: false, userName: '' }), 3000);
      } else {
        Alert.alert('Enviado!', `${INTENTION_INFO[type].emoji} enviado para ${selectedUser.name}`);
      }

      // Refresh data
      await fetchData();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      Alert.alert('Erro', err.response?.data?.message || 'Não foi possível enviar interação');
    } finally {
      setSendingInteraction(false);
      setSelectedUser(null);
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#7C3AED" />
      </SafeAreaView>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: 'Pessoas no Evento',
          headerBackTitle: 'Voltar',
        }}
      />

      <SafeAreaView className="flex-1 bg-gray-50" edges={['bottom']}>
        {/* Stats Header */}
        {stats && (
          <View className="bg-white px-6 py-4 border-b border-gray-100">
            <View className="flex-row justify-around">
              <View className="items-center">
                <Text className="text-2xl font-bold text-violet-600">{stats.sent}</Text>
                <Text className="text-gray-500 text-sm">Enviados</Text>
              </View>
              <View className="items-center">
                <Text className="text-2xl font-bold text-green-600">{stats.received}</Text>
                <Text className="text-gray-500 text-sm">Recebidos</Text>
              </View>
              {stats.remaining >= 0 && (
                <View className="items-center">
                  <Text className={`text-2xl font-bold ${stats.remaining === 0 ? 'text-red-600' : 'text-orange-600'}`}>
                    {stats.remaining}
                  </Text>
                  <Text className="text-gray-500 text-sm">Restantes</Text>
                </View>
              )}
            </View>
            {/* Daily limit warning */}
            {stats.remaining === 0 && (
              <View className="mt-3 bg-red-50 rounded-xl p-3">
                <Text className="text-red-700 text-center text-sm">
                  Limite diário de interações atingido. Renova à meia-noite.
                </Text>
              </View>
            )}
            {stats.remaining > 0 && stats.remaining <= 3 && (
              <View className="mt-3 bg-orange-50 rounded-xl p-3">
                <Text className="text-orange-700 text-center text-sm">
                  Restam apenas {stats.remaining} interações hoje
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Users List */}
        <FlatList
          data={users}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16, gap: 12 }}
          renderItem={({ item }) => (
            <Pressable
              className={`bg-white rounded-2xl p-4 shadow-sm flex-row items-center ${
                item.alreadyInteracted ? 'opacity-60' : ''
              }`}
              onPress={() => handleSelectUser(item)}
            >
              {/* Profile Picture */}
              {item.profilePicture ? (
                <Image
                  source={{ uri: item.profilePicture }}
                  className="w-16 h-16 rounded-full"
                />
              ) : (
                <View className="w-16 h-16 rounded-full bg-gray-200 items-center justify-center">
                  <Text className="text-2xl">👤</Text>
                </View>
              )}

              {/* User Info */}
              <View className="flex-1 ml-4">
                <Text className="text-lg font-semibold text-gray-900">{item.name}</Text>
                <Text className="text-gray-500">@{item.instagramUsername}</Text>

                {/* Intentions */}
                <View className="flex-row mt-2 gap-1">
                  {item.intentions.map((intention) => (
                    <Text key={intention} className="text-lg">
                      {INTENTION_INFO[intention as InteractionType]?.emoji || '❓'}
                    </Text>
                  ))}
                </View>
              </View>

              {/* Interaction Status */}
              {item.alreadyInteracted ? (
                <View className="bg-violet-100 px-3 py-2 rounded-full">
                  <Text className="text-xl">
                    {INTENTION_INFO[item.interactionType as InteractionType]?.emoji || '✓'}
                  </Text>
                </View>
              ) : stats?.remaining === 0 ? (
                <View className="bg-gray-200 px-4 py-2 rounded-full">
                  <Text className="text-gray-500 font-medium">Limite</Text>
                </View>
              ) : (
                <View className="bg-violet-600 px-4 py-2 rounded-full">
                  <Text className="text-white font-medium">Interagir</Text>
                </View>
              )}
            </Pressable>
          )}
          ListEmptyComponent={
            <View className="items-center justify-center py-20">
              <Text className="text-6xl mb-4">👥</Text>
              <Text className="text-gray-500 text-center">
                Nenhuma outra pessoa{'\n'}fez check-in ainda.
              </Text>
            </View>
          }
        />

        {/* Interaction Modal */}
        <Modal
          visible={showInteractionModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowInteractionModal(false)}
        >
          <View className="flex-1 justify-end bg-black/50">
            <View className="bg-white rounded-t-3xl px-6 py-8">
              <Text className="text-xl font-bold text-center text-gray-900 mb-2">
                Interagir com {selectedUser?.name}
              </Text>
              <Text className="text-gray-500 text-center mb-6">
                Escolha como deseja interagir
              </Text>

              <View className="flex-row flex-wrap justify-center gap-4">
                {Object.entries(INTENTION_INFO).map(([type, info]) => (
                  <Pressable
                    key={type}
                    className="items-center w-20"
                    onPress={() => handleSendInteraction(type as InteractionType)}
                    disabled={sendingInteraction}
                  >
                    <View className="w-16 h-16 rounded-full bg-violet-100 items-center justify-center mb-2">
                      <Text className="text-3xl">{info.emoji}</Text>
                    </View>
                    <Text className="text-gray-700 text-xs text-center">{info.label}</Text>
                  </Pressable>
                ))}
              </View>

              {sendingInteraction && (
                <ActivityIndicator size="small" color="#7C3AED" className="mt-4" />
              )}

              <Pressable
                className="mt-6 py-3 items-center"
                onPress={() => setShowInteractionModal(false)}
                disabled={sendingInteraction}
              >
                <Text className="text-gray-500 font-medium">Cancelar</Text>
              </Pressable>
            </View>
          </View>
        </Modal>

        {/* Match Animation Modal */}
        <Modal visible={matchAnimation.show} transparent animationType="fade">
          <View className="flex-1 items-center justify-center bg-black/80">
            <View className="items-center">
              <Text className="text-8xl mb-4">💜</Text>
              <Text className="text-4xl font-bold text-white mb-2">MATCH!</Text>
              <Text className="text-xl text-white/80 text-center">
                Você e {matchAnimation.userName}{'\n'}têm interesse mútuo!
              </Text>
              <Text className="text-white/60 mt-4">
                Faça check-in para revelar o match
              </Text>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </>
  );
}
