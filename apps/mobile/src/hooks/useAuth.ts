import { useEffect, useCallback } from 'react';
import { useRouter, useSegments } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

import { useAuthStore } from '../stores/authStore';
import { authApi } from '../services/api';

export function useAuth() {
  const router = useRouter();
  const segments = useSegments();

  const {
    user,
    isAuthenticated,
    isLoading,
    accessToken,
    loginWithInstagram,
    logout: storeLogout,
    refreshAuth,
    setUser,
  } = useAuthStore();

  // Check auth state and redirect accordingly
  useEffect(() => {
    const inAuthGroup = segments[0] === '(auth)';

    if (!isLoading) {
      if (!isAuthenticated && !inAuthGroup) {
        // User not authenticated and not on auth screens, redirect to welcome
        router.replace('/(auth)/welcome');
      } else if (isAuthenticated && inAuthGroup) {
        // User authenticated but on auth screens, redirect to home
        router.replace('/(tabs)/home');
      }
    }
  }, [isAuthenticated, segments, isLoading, router]);

  // Initialize auth state from secure storage
  const initializeAuth = useCallback(async () => {
    try {
      const token = await SecureStore.getItemAsync('accessToken');
      if (token && !user) {
        // Token exists but no user data, fetch user info
        const userData = await authApi.getMe();
        setUser(userData);
      }
    } catch (error) {
      console.error('Failed to initialize auth:', error);
      // Token might be invalid, logout
      storeLogout();
    }
  }, [user, setUser, storeLogout]);

  // Logout handler
  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      await SecureStore.deleteItemAsync('accessToken');
      await SecureStore.deleteItemAsync('refreshToken');
      storeLogout();
      router.replace('/(auth)/welcome');
    }
  }, [storeLogout, router]);

  return {
    user,
    isAuthenticated,
    isLoading,
    accessToken,
    loginWithInstagram,
    logout,
    refreshAuth,
    initializeAuth,
  };
}

export default useAuth;
