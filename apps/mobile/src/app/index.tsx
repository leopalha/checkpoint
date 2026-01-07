import { useEffect } from 'react';
import { View, Text } from 'react-native';
import { Redirect } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';

import { useAuthStore } from '@/stores/authStore';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function Index() {
  const { isAuthenticated, isLoading } = useAuthStore();

  useEffect(() => {
    // Hide native splash screen when we're ready
    if (!isLoading) {
      SplashScreen.hideAsync();
    }
  }, [isLoading]);

  if (isLoading) {
    return (
      <View className="flex-1 bg-violet-600 items-center justify-center">
        <View className="items-center">
          <Text className="text-6xl mb-4">📍</Text>
          <Text className="text-4xl font-bold text-white mb-2">CheckPoint</Text>
          <Text className="text-violet-200 text-lg">Conexões reais em eventos</Text>
        </View>
        <View className="absolute bottom-12">
          <Text className="text-violet-300 text-sm">Carregando...</Text>
        </View>
      </View>
    );
  }

  if (isAuthenticated) {
    return <Redirect href="/(tabs)/home" />;
  }

  return <Redirect href="/(auth)/welcome" />;
}
