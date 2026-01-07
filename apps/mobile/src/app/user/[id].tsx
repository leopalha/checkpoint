import {
  View,
  Text,
  ScrollView,
  Pressable,
  Image,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, Stack } from 'expo-router';

import { api } from '../../services/api';
import { InteractionType } from '@checkpoint/types';

interface UserProfile {
  id: string;
  name: string;
  instagramUsername: string;
  bio: string | null;
  profilePicture: string | null;
  defaultIntentions: InteractionType[];
  mutualEvents?: number;
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

export default function UserProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, [id]);

  const fetchProfile = async () => {
    try {
      const response = await api.get(`/users/${id}`);
      setProfile(response.data);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const openInstagram = () => {
    if (profile?.instagramUsername) {
      Linking.openURL(`https://instagram.com/${profile.instagramUsername}`);
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#7C3AED" />
      </SafeAreaView>
    );
  }

  if (!profile) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white">
        <Text className="text-gray-500">Perfil não encontrado</Text>
      </SafeAreaView>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: '',
          headerBackTitle: 'Voltar',
        }}
      />
      <ScrollView className="flex-1 bg-white">
        {/* Profile Header */}
        <View className="items-center px-6 py-8">
          {/* Profile Picture */}
          {profile.profilePicture ? (
            <Image
              source={{ uri: profile.profilePicture }}
              className="w-32 h-32 rounded-full"
            />
          ) : (
            <View className="w-32 h-32 rounded-full bg-gray-200 items-center justify-center">
              <Text className="text-5xl">👤</Text>
            </View>
          )}

          {/* Name */}
          <Text className="text-2xl font-bold text-gray-900 mt-4">
            {profile.name}
          </Text>

          {/* Instagram */}
          <Pressable onPress={openInstagram}>
            <Text className="text-violet-600 font-medium mt-1">
              @{profile.instagramUsername}
            </Text>
          </Pressable>

          {/* Bio */}
          {profile.bio && (
            <Text className="text-gray-600 text-center mt-4 px-4 leading-6">
              {profile.bio}
            </Text>
          )}

          {/* Mutual Events */}
          {profile.mutualEvents !== undefined && profile.mutualEvents > 0 && (
            <View className="bg-violet-100 px-4 py-2 rounded-full mt-4">
              <Text className="text-violet-700">
                {profile.mutualEvents} evento{profile.mutualEvents !== 1 ? 's' : ''} em comum
              </Text>
            </View>
          )}
        </View>

        {/* Intentions */}
        <View className="px-6 pb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            Geralmente busca
          </Text>
          <View className="flex-row flex-wrap gap-3">
            {profile.defaultIntentions.map((intention) => {
              const info = INTENTION_INFO[intention];
              if (!info) return null;
              return (
                <View
                  key={intention}
                  className="flex-row items-center px-4 py-2 rounded-full bg-gray-100"
                >
                  <Text className="text-xl mr-2">{info.emoji}</Text>
                  <Text className="text-gray-700">{info.label}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Actions */}
        <View className="px-6 pb-8">
          <Pressable
            className="py-4 rounded-2xl items-center bg-gradient-to-r from-pink-500 to-purple-500 bg-pink-500"
            onPress={openInstagram}
          >
            <View className="flex-row items-center">
              <Text className="text-xl mr-2">📸</Text>
              <Text className="text-white font-semibold text-lg">
                Ver no Instagram
              </Text>
            </View>
          </Pressable>
        </View>
      </ScrollView>
    </>
  );
}
