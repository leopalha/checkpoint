import { View, Text, Pressable, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';

import { useAuthStore } from '@/stores/authStore';
import { api } from '@/services/api';

interface UserStats {
  eventsAttended: number;
  totalMatches: number;
  totalCheckIns: number;
}

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [stats, setStats] = useState<UserStats>({
    eventsAttended: 0,
    totalMatches: 0,
    totalCheckIns: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [matchesRes, presencesRes] = await Promise.all([
        api.get('/matches/stats'),
        api.get('/presence/my'),
      ]);

      setStats({
        eventsAttended: presencesRes.data?.length || 0,
        totalMatches: matchesRes.data?.total || 0,
        totalCheckIns: presencesRes.data?.filter((p: { checkedInAt: unknown }) => p.checkedInAt)?.length || 0,
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const handleLogout = () => {
    logout();
    router.replace('/(auth)/welcome');
  };

  const handleEditProfile = () => {
    router.push('/profile/edit');
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView>
        {/* Profile Header */}
        <View className="bg-white px-6 py-8 items-center border-b border-gray-100">
          {/* Avatar */}
          <Pressable onPress={handleEditProfile}>
            {user?.profilePicture ? (
              <Image
                source={{ uri: user.profilePicture }}
                className="w-24 h-24 rounded-full"
              />
            ) : (
              <View className="w-24 h-24 bg-gray-200 rounded-full items-center justify-center">
                <Text className="text-4xl">👤</Text>
              </View>
            )}
          </Pressable>
          <Pressable onPress={handleEditProfile} className="mt-2">
            <Text className="text-violet-600 font-medium">Editar foto</Text>
          </Pressable>

          {/* Name */}
          <Text className="text-xl font-bold text-gray-900 mt-4">
            {user?.name || 'Usuário CheckPoint'}
          </Text>
          <Text className="text-gray-500">@{user?.instagramUsername || 'usuario'}</Text>

          {/* Bio */}
          {user?.bio && (
            <Text className="text-gray-600 text-center mt-2 px-4">
              {user.bio}
            </Text>
          )}

          {/* Edit Profile Button */}
          <Pressable
            className="mt-4 border border-violet-600 px-6 py-2 rounded-full"
            onPress={handleEditProfile}
          >
            <Text className="text-violet-600 font-medium">Editar perfil</Text>
          </Pressable>
        </View>

        {/* Stats */}
        <View className="bg-white mt-3 px-6 py-4 flex-row justify-around">
          <View className="items-center">
            <Text className="text-2xl font-bold text-gray-900">{stats.eventsAttended}</Text>
            <Text className="text-gray-500 text-sm">eventos</Text>
          </View>
          <View className="items-center">
            <Text className="text-2xl font-bold text-gray-900">{stats.totalMatches}</Text>
            <Text className="text-gray-500 text-sm">matches</Text>
          </View>
          <View className="items-center">
            <Text className="text-2xl font-bold text-gray-900">{stats.totalCheckIns}</Text>
            <Text className="text-gray-500 text-sm">check-ins</Text>
          </View>
        </View>

        {/* Premium */}
        {!user?.isPremium && (
          <View className="bg-violet-600 mx-4 mt-6 p-4 rounded-2xl">
            <Text className="text-white font-bold text-lg">
              CheckPoint Premium
            </Text>
            <Text className="text-violet-100 mt-1">
              Curtidas ilimitadas, veja quem curtiu você
            </Text>
            <Pressable className="bg-white mt-3 py-2 px-4 rounded-full self-start">
              <Text className="text-violet-600 font-medium">
                Upgrade - R$ 19,90/mês
              </Text>
            </Pressable>
          </View>
        )}

        {user?.isPremium && (
          <View className="bg-gradient-to-r from-amber-500 to-orange-500 mx-4 mt-6 p-4 rounded-2xl">
            <View className="flex-row items-center">
              <Text className="text-2xl mr-2">👑</Text>
              <Text className="text-white font-bold text-lg">Premium Ativo</Text>
            </View>
            <Text className="text-amber-100 mt-1">
              Você tem acesso a todos os recursos premium
            </Text>
          </View>
        )}

        {/* Daily Likes Counter */}
        <View className="bg-white mx-4 mt-4 p-4 rounded-2xl">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-gray-700 font-medium">Curtidas hoje</Text>
              <Text className="text-gray-500 text-sm">
                Renovam à meia-noite
              </Text>
            </View>
            <View className="bg-violet-100 px-4 py-2 rounded-full">
              <Text className="text-violet-600 font-bold text-lg">
                {user?.dailyLikesRemaining ?? 10}/10
              </Text>
            </View>
          </View>
        </View>

        {/* Menu */}
        <View className="bg-white mt-6 mx-4 rounded-2xl overflow-hidden">
          <Pressable
            className="flex-row items-center px-4 py-4 border-b border-gray-100"
            onPress={() => router.push('/settings')}
          >
            <Text className="text-xl mr-3">⚙️</Text>
            <Text className="text-gray-900 flex-1">Configurações</Text>
            <Text className="text-gray-400">›</Text>
          </Pressable>
          <Pressable
            className="flex-row items-center px-4 py-4 border-b border-gray-100"
            onPress={() => router.push('/help')}
          >
            <Text className="text-xl mr-3">❓</Text>
            <Text className="text-gray-900 flex-1">Ajuda</Text>
            <Text className="text-gray-400">›</Text>
          </Pressable>
          <Pressable
            className="flex-row items-center px-4 py-4"
            onPress={handleLogout}
          >
            <Text className="text-xl mr-3">🚪</Text>
            <Text className="text-red-500 flex-1">Sair</Text>
          </Pressable>
        </View>

        {/* Footer */}
        <Text className="text-gray-400 text-center mt-8 mb-4 text-sm">
          CheckPoint v0.1.0
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
