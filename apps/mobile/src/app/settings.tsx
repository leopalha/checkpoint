import { View, Text, Pressable, ScrollView, Switch, Alert, Linking } from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Stack } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

import { useAuthStore } from '../stores/authStore';
import { usersApi } from '../services/api';

const TERMS_URL = 'https://checkpoint.app/termos';
const PRIVACY_URL = 'https://checkpoint.app/privacidade';

const SETTINGS_KEY = 'checkpoint-settings';

interface Settings {
  notificationsEnabled: boolean;
  locationEnabled: boolean;
}

export default function SettingsScreen() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [isLoadingSettings, setIsLoadingSettings] = useState(true);

  // Load settings from storage
  useEffect(() => {
    (async () => {
      try {
        const stored = await SecureStore.getItemAsync(SETTINGS_KEY);
        if (stored) {
          const settings: Settings = JSON.parse(stored);
          setNotificationsEnabled(settings.notificationsEnabled);
          setLocationEnabled(settings.locationEnabled);
        }
      } catch (error) {
        console.error('Failed to load settings:', error);
      } finally {
        setIsLoadingSettings(false);
      }
    })();
  }, []);

  // Save settings to storage
  const saveSettings = useCallback(async (newSettings: Settings) => {
    try {
      await SecureStore.setItemAsync(SETTINGS_KEY, JSON.stringify(newSettings));
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  }, []);

  const handleNotificationsChange = async (value: boolean) => {
    setNotificationsEnabled(value);
    await saveSettings({ notificationsEnabled: value, locationEnabled });
  };

  const handleLocationChange = async (value: boolean) => {
    setLocationEnabled(value);
    await saveSettings({ notificationsEnabled, locationEnabled: value });
  };

  const handleExportData = async () => {
    setIsExporting(true);
    try {
      await usersApi.exportData();
      Alert.alert(
        'Dados Exportados',
        'Seus dados foram exportados. Em breve você receberá um email com o arquivo.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível exportar seus dados. Tente novamente.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Excluir Conta',
      'Tem certeza que deseja excluir sua conta? Esta ação agendará a exclusão dos seus dados em 30 dias. Você pode cancelar a exclusão fazendo login novamente.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            setIsDeletingAccount(true);
            try {
              await usersApi.deleteAccount();
              Alert.alert(
                'Conta Agendada para Exclusão',
                'Sua conta será excluída em 30 dias. Faça login novamente se quiser cancelar.',
                [
                  {
                    text: 'OK',
                    onPress: () => {
                      logout();
                      router.replace('/(auth)/welcome');
                    },
                  },
                ]
              );
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível excluir sua conta. Tente novamente.');
              setIsDeletingAccount(false);
            }
          },
        },
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert('Sair', 'Tem certeza que deseja sair?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: () => {
          logout();
          router.replace('/(auth)/welcome');
        },
      },
    ]);
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: 'Configurações',
          headerBackTitle: 'Voltar',
        }}
      />
      <SafeAreaView className="flex-1 bg-gray-50" edges={['bottom']}>
        <ScrollView>
          {/* Account Section */}
          <View className="mt-6">
            <Text className="px-6 text-sm font-medium text-gray-500 uppercase mb-2">
              Conta
            </Text>
            <View className="bg-white">
              <View className="px-6 py-4 border-b border-gray-100">
                <Text className="text-gray-900 font-medium">Email</Text>
                <Text className="text-gray-500 mt-1">
                  Conectado via Instagram
                </Text>
              </View>
              <View className="px-6 py-4 border-b border-gray-100">
                <Text className="text-gray-900 font-medium">Instagram</Text>
                <Text className="text-gray-500 mt-1">
                  @{user?.instagramUsername || 'usuario'}
                </Text>
              </View>
              <View className="px-6 py-4 border-b border-gray-100">
                <Text className="text-gray-900 font-medium">Plano</Text>
                <Text className="text-gray-500 mt-1">
                  {user?.isPremium ? 'Premium' : 'Gratuito'}
                </Text>
              </View>
            </View>
          </View>

          {/* Notifications Section */}
          <View className="mt-6">
            <Text className="px-6 text-sm font-medium text-gray-500 uppercase mb-2">
              Notificações
            </Text>
            <View className="bg-white">
              <View className="px-6 py-4 flex-row items-center justify-between border-b border-gray-100">
                <View>
                  <Text className="text-gray-900 font-medium">Notificações Push</Text>
                  <Text className="text-gray-500 text-sm mt-1">
                    Matches, mensagens e eventos
                  </Text>
                </View>
                <Switch
                  value={notificationsEnabled}
                  onValueChange={handleNotificationsChange}
                  trackColor={{ false: '#D1D5DB', true: '#A78BFA' }}
                  thumbColor={notificationsEnabled ? '#7C3AED' : '#F3F4F6'}
                  disabled={isLoadingSettings}
                />
              </View>
            </View>
          </View>

          {/* Privacy Section */}
          <View className="mt-6">
            <Text className="px-6 text-sm font-medium text-gray-500 uppercase mb-2">
              Privacidade
            </Text>
            <View className="bg-white">
              <View className="px-6 py-4 flex-row items-center justify-between border-b border-gray-100">
                <View>
                  <Text className="text-gray-900 font-medium">Localização</Text>
                  <Text className="text-gray-500 text-sm mt-1">
                    Permite check-in por GPS
                  </Text>
                </View>
                <Switch
                  value={locationEnabled}
                  onValueChange={handleLocationChange}
                  trackColor={{ false: '#D1D5DB', true: '#A78BFA' }}
                  thumbColor={locationEnabled ? '#7C3AED' : '#F3F4F6'}
                  disabled={isLoadingSettings}
                />
              </View>
              <Pressable
                className="px-6 py-4 border-b border-gray-100"
                onPress={handleExportData}
                disabled={isExporting}
              >
                <Text className="text-gray-900 font-medium">
                  {isExporting ? 'Exportando...' : 'Exportar meus dados'}
                </Text>
                <Text className="text-gray-500 text-sm mt-1">
                  Conforme LGPD
                </Text>
              </Pressable>
            </View>
          </View>

          {/* About Section */}
          <View className="mt-6">
            <Text className="px-6 text-sm font-medium text-gray-500 uppercase mb-2">
              Sobre
            </Text>
            <View className="bg-white">
              <Pressable
                className="px-6 py-4 border-b border-gray-100"
                onPress={() => Linking.openURL(TERMS_URL)}
              >
                <Text className="text-gray-900 font-medium">Termos de Uso</Text>
              </Pressable>
              <Pressable
                className="px-6 py-4 border-b border-gray-100"
                onPress={() => Linking.openURL(PRIVACY_URL)}
              >
                <Text className="text-gray-900 font-medium">Política de Privacidade</Text>
              </Pressable>
              <View className="px-6 py-4">
                <Text className="text-gray-900 font-medium">Versão</Text>
                <Text className="text-gray-500 mt-1">0.1.0</Text>
              </View>
            </View>
          </View>

          {/* Danger Zone */}
          <View className="mt-6 mb-8">
            <Text className="px-6 text-sm font-medium text-gray-500 uppercase mb-2">
              Zona de Perigo
            </Text>
            <View className="bg-white">
              <Pressable
                className="px-6 py-4 border-b border-gray-100"
                onPress={handleLogout}
              >
                <Text className="text-orange-600 font-medium">Sair da conta</Text>
              </Pressable>
              <Pressable
                className="px-6 py-4"
                onPress={handleDeleteAccount}
                disabled={isDeletingAccount}
              >
                <Text className="text-red-600 font-medium">
                  {isDeletingAccount ? 'Excluindo...' : 'Excluir minha conta'}
                </Text>
                <Text className="text-gray-500 text-sm mt-1">
                  Esta ação não pode ser desfeita
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
