import { View, Text, ActivityIndicator, Pressable } from 'react-native';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';

import { useAuthStore } from '@/stores/authStore';
import { exchangeCodeForTokens } from '@/services/auth';

WebBrowser.maybeCompleteAuthSession();

const INSTAGRAM_CLIENT_ID = process.env.EXPO_PUBLIC_INSTAGRAM_CLIENT_ID || '';

const discovery = {
  authorizationEndpoint: 'https://api.instagram.com/oauth/authorize',
  tokenEndpoint: 'https://api.instagram.com/oauth/access_token',
};

export default function InstagramLoginScreen() {
  const router = useRouter();
  const { setUser, setTokens } = useAuthStore();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const redirectUri = AuthSession.makeRedirectUri({
    scheme: 'checkpoint',
    path: 'auth/callback',
  });

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: INSTAGRAM_CLIENT_ID,
      scopes: ['user_profile'],
      redirectUri,
      responseType: AuthSession.ResponseType.Code,
    },
    discovery
  );

  useEffect(() => {
    // Auto-start auth if client ID is configured
    if (INSTAGRAM_CLIENT_ID && request) {
      promptAsync();
    } else if (!INSTAGRAM_CLIENT_ID) {
      // Dev mode: simulate login
      setIsLoading(true);
      const timer = setTimeout(() => {
        router.replace('/(auth)/create-profile');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [request]);

  useEffect(() => {
    const handleResponse = async () => {
      if (response?.type === 'success' && response.params.code) {
        setIsLoading(true);
        setError(null);

        const result = await exchangeCodeForTokens(
          response.params.code,
          redirectUri
        );

        if (result.success && result.data) {
          setTokens(result.data.accessToken, result.data.refreshToken);
          setUser(result.data.user);

          if (result.data.isNewUser) {
            router.replace('/(auth)/create-profile');
          } else {
            router.replace('/(tabs)/home');
          }
        } else {
          setError(result.error || 'Authentication failed');
          setIsLoading(false);
        }
      } else if (response?.type === 'error') {
        setError(response.error?.message || 'Authentication failed');
        setIsLoading(false);
      } else if (response?.type === 'cancel') {
        router.back();
      }
    };

    if (response) {
      handleResponse();
    }
  }, [response]);

  const handleRetry = () => {
    setError(null);
    setIsLoading(true);
    if (request) {
      promptAsync();
    }
  };

  if (error) {
    return (
      <View className="flex-1 bg-white items-center justify-center px-8">
        <Text className="text-6xl mb-4">😕</Text>
        <Text className="text-xl font-semibold text-gray-900 mb-2">
          Ops! Algo deu errado
        </Text>
        <Text className="text-gray-500 text-center mb-6">{error}</Text>
        <Pressable
          className="bg-violet-600 px-8 py-3 rounded-full"
          onPress={handleRetry}
        >
          <Text className="text-white font-medium">Tentar novamente</Text>
        </Pressable>
        <Pressable className="mt-4" onPress={() => router.back()}>
          <Text className="text-gray-500">Voltar</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white items-center justify-center">
      <ActivityIndicator size="large" color="#7C3AED" />
      <Text className="text-gray-600 mt-4">
        {isLoading ? 'Conectando ao Instagram...' : 'Aguardando autenticação...'}
      </Text>
    </View>
  );
}
