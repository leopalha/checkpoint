import { View, Text, TextInput, Pressable, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';

import { InteractionType } from '@checkpoint/types';
import { usersApi } from '../../services/api';
import { useAuthStore } from '../../stores/authStore';

const INTENTIONS: { type: InteractionType; emoji: string; label: string }[] = [
  { type: 'fire', emoji: '🔥', label: 'Paquera' },
  { type: 'handshake', emoji: '🤝', label: 'Networking' },
  { type: 'highfive', emoji: '✋', label: 'Amizade' },
  { type: 'carona', emoji: '🚗', label: 'Carona' },
  { type: 'ticket', emoji: '🎟️', label: 'Ingresso' },
  { type: 'champagne', emoji: '🍾', label: 'Rolê' },
  { type: 'briefcase', emoji: '💼', label: 'Negócios' },
  { type: 'target', emoji: '🎯', label: 'Objetivo' },
];

export default function CreateProfileScreen() {
  const router = useRouter();
  const { user, setUser } = useAuthStore();
  const [bio, setBio] = useState(user?.bio || '');
  const [selectedIntentions, setSelectedIntentions] = useState<InteractionType[]>(
    (user?.defaultIntentions as InteractionType[]) || []
  );
  const [isLoading, setIsLoading] = useState(false);

  const toggleIntention = (type: InteractionType) => {
    setSelectedIntentions((prev) =>
      prev.includes(type)
        ? prev.filter((t) => t !== type)
        : [...prev, type]
    );
  };

  const handleCreateProfile = async () => {
    if (selectedIntentions.length === 0) {
      Alert.alert('Atenção', 'Selecione pelo menos uma intenção');
      return;
    }

    setIsLoading(true);
    try {
      const updatedUser = await usersApi.updateProfile({
        bio: bio.trim() || undefined,
        defaultIntentions: selectedIntentions,
      });

      setUser({
        ...user!,
        bio: updatedUser.bio,
        defaultIntentions: updatedUser.defaultIntentions,
      });

      router.replace('/(tabs)/home');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar seu perfil. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="px-6 pt-16 pb-8">
        {/* Header */}
        <Text className="text-3xl font-bold text-gray-900">
          Criar seu perfil
        </Text>
        <Text className="text-gray-500 mt-2">
          Complete seu perfil para começar a usar o CheckPoint
        </Text>

        {/* Profile Photo */}
        <View className="items-center mt-8">
          <View className="w-28 h-28 bg-gray-200 rounded-full items-center justify-center">
            <Text className="text-4xl">👤</Text>
          </View>
          <Text className="text-violet-600 mt-2 font-medium">
            Editar foto
          </Text>
        </View>

        {/* Bio */}
        <View className="mt-8">
          <Text className="text-gray-700 font-medium mb-2">Bio</Text>
          <TextInput
            className="bg-gray-100 rounded-xl px-4 py-3 text-gray-900"
            placeholder="Fale um pouco sobre você..."
            value={bio}
            onChangeText={setBio}
            maxLength={150}
            multiline
            numberOfLines={3}
          />
          <Text className="text-gray-400 text-right mt-1">
            {bio.length}/150
          </Text>
        </View>

        {/* Intentions */}
        <View className="mt-6">
          <Text className="text-gray-700 font-medium mb-2">
            Suas intenções padrão
          </Text>
          <Text className="text-gray-500 text-sm mb-4">
            O que você geralmente busca em eventos?
          </Text>
          <View className="flex-row flex-wrap gap-3">
            {INTENTIONS.map(({ type, emoji, label }) => (
              <Pressable
                key={type}
                className={`flex-row items-center px-4 py-3 rounded-full border-2 ${
                  selectedIntentions.includes(type)
                    ? 'border-violet-600 bg-violet-50'
                    : 'border-gray-200 bg-white'
                }`}
                onPress={() => toggleIntention(type)}
              >
                <Text className="text-xl mr-2">{emoji}</Text>
                <Text
                  className={
                    selectedIntentions.includes(type)
                      ? 'text-violet-600 font-medium'
                      : 'text-gray-700'
                  }
                >
                  {label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Create Button */}
        <Pressable
          className={`mt-10 py-4 rounded-2xl items-center ${
            isLoading ? 'bg-violet-400' : 'bg-violet-600'
          }`}
          onPress={handleCreateProfile}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-semibold text-lg">
              Criar Perfil
            </Text>
          )}
        </Pressable>

        {/* Skip Button */}
        <Pressable
          className="mt-4 py-3 items-center"
          onPress={() => router.replace('/(tabs)/home')}
          disabled={isLoading}
        >
          <Text className="text-gray-500 font-medium">
            Pular por agora
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
