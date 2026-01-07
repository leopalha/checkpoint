import { View, Text, Pressable, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';

import { useAuthStore } from '@/stores/authStore';
import { api } from '@/services/api';

interface UserStats {
  eventsAttended: number;
  totalMatches: number;
  totalCheckIns: number;
  rematchConnections: number;
}

const INTENTION_LABELS: Record<string, { emoji: string; label: string }> = {
  fire: { emoji: '🔥', label: 'Paquera' },
  handshake: { emoji: '🤝', label: 'Network' },
  highfive: { emoji: '✋', label: 'Amizade' },
  carona: { emoji: '🚗', label: 'Carona' },
  ticket: { emoji: '🎫', label: 'Ingresso' },
  champagne: { emoji: '🍾', label: 'VIP' },
  briefcase: { emoji: '💼', label: 'Negócios' },
};

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [stats, setStats] = useState<UserStats>({
    eventsAttended: 0,
    totalMatches: 0,
    totalCheckIns: 0,
    rematchConnections: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [matchesRes, presencesRes, rematchRes] = await Promise.all([
        api.get('/matches/stats'),
        api.get('/presence/my'),
        api.get('/rematches/stats').catch(() => ({ data: { connectionsFromRematch: 0 } })),
      ]);

      setStats({
        eventsAttended: presencesRes.data?.length || 0,
        totalMatches: matchesRes.data?.total || 0,
        totalCheckIns: presencesRes.data?.filter((p: { checkedInAt: unknown }) => p.checkedInAt)?.length || 0,
        rematchConnections: rematchRes.data?.connectionsFromRematch || 0,
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

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
    : 'Janeiro 2024';

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header with Gradient */}
        <LinearGradient
          colors={['#7C3AED', '#D946EF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="px-6 pt-8 pb-16"
        >
          <View className="items-center">
            {/* Avatar with border */}
            <Pressable onPress={handleEditProfile}>
              <View className="p-1 rounded-full bg-white/30">
                {user?.profilePicture ? (
                  <Image
                    source={{ uri: user.profilePicture }}
                    className="w-28 h-28 rounded-full border-4 border-white"
                  />
                ) : (
                  <View className="w-28 h-28 bg-white rounded-full items-center justify-center border-4 border-white">
                    <Text className="text-5xl">👤</Text>
                  </View>
                )}
              </View>
              {/* Edit badge */}
              <View className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg">
                <Text className="text-lg">✏️</Text>
              </View>
            </Pressable>

            {/* Name and Username */}
            <Text className="text-2xl font-bold text-white mt-4">
              {user?.name || 'Usuário CheckPoint'}
            </Text>
            <Text className="text-white/80 text-lg">@{user?.instagramUsername || 'usuario'}</Text>

            {/* Bio */}
            {user?.bio && (
              <Text className="text-white/90 text-center mt-3 px-4 text-base">
                {user.bio}
              </Text>
            )}

            {/* Member since */}
            <Text className="text-white/60 mt-3 text-sm">
              Membro desde {memberSince}
            </Text>
          </View>
        </LinearGradient>

        {/* Stats Cards - Overlapping */}
        <View className="px-4 -mt-10">
          <View className="bg-white rounded-2xl p-4 shadow-lg">
            <View className="flex-row justify-around">
              <Pressable
                className="items-center flex-1"
                onPress={() => router.push('/(tabs)/home')}
              >
                <View className="bg-violet-100 w-14 h-14 rounded-2xl items-center justify-center mb-2">
                  <Text className="text-2xl">📅</Text>
                </View>
                <Text className="text-2xl font-bold text-gray-900">{stats.eventsAttended}</Text>
                <Text className="text-gray-500 text-sm">eventos</Text>
              </Pressable>

              <View className="w-px bg-gray-200" />

              <Pressable
                className="items-center flex-1"
                onPress={() => router.push('/(tabs)/matches')}
              >
                <View className="bg-pink-100 w-14 h-14 rounded-2xl items-center justify-center mb-2">
                  <Text className="text-2xl">💜</Text>
                </View>
                <Text className="text-2xl font-bold text-gray-900">{stats.totalMatches}</Text>
                <Text className="text-gray-500 text-sm">matches</Text>
              </Pressable>

              <View className="w-px bg-gray-200" />

              <Pressable
                className="items-center flex-1"
                onPress={() => router.push('/(tabs)/rematch')}
              >
                <View className="bg-cyan-100 w-14 h-14 rounded-2xl items-center justify-center mb-2">
                  <Text className="text-2xl">🔄</Text>
                </View>
                <Text className="text-2xl font-bold text-gray-900">{stats.rematchConnections}</Text>
                <Text className="text-gray-500 text-sm">rematches</Text>
              </Pressable>
            </View>
          </View>
        </View>

        {/* Intentions */}
        {user?.defaultIntentions && user.defaultIntentions.length > 0 && (
          <View className="px-4 mt-6">
            <Text className="text-gray-700 font-semibold mb-3 px-2">
              Suas Intenções
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {user.defaultIntentions.map((intention) => {
                const info = INTENTION_LABELS[intention] || { emoji: '✨', label: intention };
                return (
                  <View
                    key={intention}
                    className="bg-white px-4 py-2 rounded-full flex-row items-center shadow-sm"
                  >
                    <Text className="text-lg mr-2">{info.emoji}</Text>
                    <Text className="text-gray-700 font-medium">{info.label}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {/* Premium Card */}
        {!user?.isPremium ? (
          <View className="px-4 mt-6">
            <LinearGradient
              colors={['#F59E0B', '#EF4444']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="rounded-2xl p-5"
            >
              <View className="flex-row items-center mb-2">
                <Text className="text-2xl mr-2">👑</Text>
                <Text className="text-white font-bold text-xl">CheckPoint Premium</Text>
              </View>
              <Text className="text-white/90 text-base mb-4">
                Curtidas ilimitadas, veja quem curtiu você, ReMatch ilimitado e muito mais!
              </Text>
              <View className="flex-row gap-3">
                <View className="flex-1">
                  <Pressable className="bg-white py-3 px-4 rounded-xl">
                    <Text className="text-orange-600 font-bold text-center">
                      R$ 19,90/mês
                    </Text>
                  </Pressable>
                </View>
                <Pressable className="bg-white/20 py-3 px-4 rounded-xl">
                  <Text className="text-white font-medium">Saiba mais</Text>
                </Pressable>
              </View>
            </LinearGradient>
          </View>
        ) : (
          <View className="px-4 mt-6">
            <LinearGradient
              colors={['#F59E0B', '#D97706']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="rounded-2xl p-5"
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <Text className="text-3xl mr-3">👑</Text>
                  <View>
                    <Text className="text-white font-bold text-lg">Premium Ativo</Text>
                    <Text className="text-white/80">Acesso completo</Text>
                  </View>
                </View>
                <View className="bg-white/20 px-3 py-1 rounded-full">
                  <Text className="text-white font-medium">✓</Text>
                </View>
              </View>
            </LinearGradient>
          </View>
        )}

        {/* Daily Likes */}
        <View className="px-4 mt-4">
          <View className="bg-white rounded-2xl p-4 shadow-sm">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <View className="bg-violet-100 w-12 h-12 rounded-xl items-center justify-center mr-3">
                  <Text className="text-2xl">💜</Text>
                </View>
                <View>
                  <Text className="text-gray-900 font-semibold">Curtidas hoje</Text>
                  <Text className="text-gray-500 text-sm">Renovam à meia-noite</Text>
                </View>
              </View>
              <View className="items-end">
                <Text className="text-violet-600 font-bold text-2xl">
                  {user?.dailyLikesRemaining ?? 10}
                </Text>
                <Text className="text-gray-400 text-sm">de 10</Text>
              </View>
            </View>
            {/* Progress bar */}
            <View className="mt-3 bg-gray-100 h-2 rounded-full overflow-hidden">
              <View
                className="bg-violet-600 h-full rounded-full"
                style={{ width: `${((user?.dailyLikesRemaining ?? 10) / 10) * 100}%` }}
              />
            </View>
          </View>
        </View>

        {/* Menu */}
        <View className="px-4 mt-6">
          <Text className="text-gray-700 font-semibold mb-3 px-2">
            Configurações
          </Text>
          <View className="bg-white rounded-2xl overflow-hidden shadow-sm">
            <Pressable
              className="flex-row items-center px-4 py-4 border-b border-gray-100"
              onPress={handleEditProfile}
            >
              <View className="bg-blue-100 w-10 h-10 rounded-xl items-center justify-center mr-3">
                <Text className="text-lg">✏️</Text>
              </View>
              <Text className="text-gray-900 flex-1 font-medium">Editar Perfil</Text>
              <Text className="text-gray-400 text-xl">›</Text>
            </Pressable>

            <Pressable
              className="flex-row items-center px-4 py-4 border-b border-gray-100"
              onPress={() => router.push('/settings')}
            >
              <View className="bg-gray-100 w-10 h-10 rounded-xl items-center justify-center mr-3">
                <Text className="text-lg">⚙️</Text>
              </View>
              <Text className="text-gray-900 flex-1 font-medium">Configurações</Text>
              <Text className="text-gray-400 text-xl">›</Text>
            </Pressable>

            <Pressable
              className="flex-row items-center px-4 py-4 border-b border-gray-100"
              onPress={() => router.push('/help')}
            >
              <View className="bg-purple-100 w-10 h-10 rounded-xl items-center justify-center mr-3">
                <Text className="text-lg">❓</Text>
              </View>
              <Text className="text-gray-900 flex-1 font-medium">Central de Ajuda</Text>
              <Text className="text-gray-400 text-xl">›</Text>
            </Pressable>

            <Pressable
              className="flex-row items-center px-4 py-4"
              onPress={handleLogout}
            >
              <View className="bg-red-100 w-10 h-10 rounded-xl items-center justify-center mr-3">
                <Text className="text-lg">🚪</Text>
              </View>
              <Text className="text-red-500 flex-1 font-medium">Sair da Conta</Text>
            </Pressable>
          </View>
        </View>

        {/* Footer */}
        <View className="items-center py-8">
          <View className="flex-row items-center">
            <View className="w-8 h-8 bg-violet-600 rounded-lg items-center justify-center mr-2">
              <Text className="text-white font-bold">C</Text>
            </View>
            <Text className="text-gray-400 font-medium">CheckPoint v0.1.0</Text>
          </View>
          <Text className="text-gray-400 text-sm mt-1">
            Conectando pessoas em eventos
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
