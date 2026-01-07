'use client';

import { View, Text, TextInput, Pressable, ScrollView, ActivityIndicator, Alert, Image } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';

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

export default function EditProfileScreen() {
  const router = useRouter();
  const { user, setUser } = useAuthStore();
  const [bio, setBio] = useState(user?.bio || '');
  const [selectedIntentions, setSelectedIntentions] = useState<InteractionType[]>(
    (user?.defaultIntentions as InteractionType[]) || []
  );
  const [profileImage, setProfileImage] = useState<string | null>(user?.profilePicture || null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const toggleIntention = (type: InteractionType) => {
    setSelectedIntentions((prev) =>
      prev.includes(type)
        ? prev.filter((t) => t !== type)
        : [...prev, type]
    );
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Precisamos de acesso à sua galeria para alterar a foto.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const uri = result.assets[0].uri;
      setProfileImage(uri);

      // Upload immediately
      setIsUploadingImage(true);
      try {
        const response = await usersApi.uploadProfilePicture(uri);
        setProfileImage(response.url);
        setUser({
          ...user!,
          profilePicture: response.url,
        });
        Alert.alert('Sucesso', 'Foto atualizada!');
      } catch (error) {
        console.error('Image upload failed:', error);
        Alert.alert('Erro', 'Não foi possível atualizar a foto. Tente novamente.');
        setProfileImage(user?.profilePicture || null);
      } finally {
        setIsUploadingImage(false);
      }
    }
  };

  const handleSave = async () => {
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

      Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
      router.back();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar seu perfil. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['bottom']}>
      <ScrollView>
        <View className="px-6 py-6">
          {/* Profile Photo */}
          <View className="items-center">
            <Pressable onPress={pickImage} disabled={isUploadingImage}>
              {profileImage ? (
                <Image
                  source={{ uri: profileImage }}
                  className="w-28 h-28 rounded-full"
                />
              ) : (
                <View className="w-28 h-28 bg-gray-200 rounded-full items-center justify-center">
                  <Text className="text-4xl">👤</Text>
                </View>
              )}
              {isUploadingImage ? (
                <View className="absolute inset-0 items-center justify-center bg-black/30 rounded-full">
                  <ActivityIndicator size="large" color="#7C3AED" />
                </View>
              ) : (
                <View className="absolute bottom-0 right-0 bg-violet-600 w-8 h-8 rounded-full items-center justify-center">
                  <Text className="text-white">📷</Text>
                </View>
              )}
            </Pressable>
            <Text className="text-violet-600 mt-2 font-medium">
              {isUploadingImage ? 'Enviando...' : 'Alterar foto'}
            </Text>
          </View>

          {/* Instagram Info (read-only) */}
          <View className="mt-8 bg-gray-50 rounded-xl p-4">
            <Text className="text-gray-500 text-sm mb-1">Instagram</Text>
            <Text className="text-gray-900 font-medium">
              @{user?.instagramUsername || 'usuario'}
            </Text>
            <Text className="text-gray-400 text-xs mt-1">
              Conectado via Instagram
            </Text>
          </View>

          {/* Name (from Instagram) */}
          <View className="mt-4">
            <Text className="text-gray-700 font-medium mb-2">Nome</Text>
            <View className="bg-gray-100 rounded-xl px-4 py-3">
              <Text className="text-gray-600">{user?.name || 'Usuário'}</Text>
            </View>
            <Text className="text-gray-400 text-xs mt-1">
              Sincronizado com seu Instagram
            </Text>
          </View>

          {/* Bio */}
          <View className="mt-6">
            <Text className="text-gray-700 font-medium mb-2">Bio</Text>
            <TextInput
              className="bg-gray-100 rounded-xl px-4 py-3 text-gray-900 min-h-[100px]"
              placeholder="Fale um pouco sobre você..."
              value={bio}
              onChangeText={setBio}
              maxLength={150}
              multiline
              textAlignVertical="top"
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

          {/* Save Button */}
          <Pressable
            className={`mt-10 py-4 rounded-2xl items-center ${
              isLoading ? 'bg-violet-400' : 'bg-violet-600'
            }`}
            onPress={handleSave}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-semibold text-lg">
                Salvar Alterações
              </Text>
            )}
          </Pressable>

          {/* Cancel Button */}
          <Pressable
            className="mt-4 py-3 items-center"
            onPress={() => router.back()}
            disabled={isLoading}
          >
            <Text className="text-gray-500 font-medium">
              Cancelar
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
