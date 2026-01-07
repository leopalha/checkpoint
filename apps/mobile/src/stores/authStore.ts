import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import * as SecureStore from 'expo-secure-store';

import { User } from '@checkpoint/types';
import { authApi } from '../services/api';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthActions {
  setUser: (user: User) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  loginWithInstagram: (code: string, redirectUri: string) => Promise<unknown>;
  logout: () => void;
  refreshAuth: () => Promise<void>;
  initializeAuth: () => Promise<void>;
}

type AuthStore = AuthState & AuthActions;

// Custom storage for secure token storage
const secureStorage = {
  getItem: async (name: string): Promise<string | null> => {
    return await SecureStore.getItemAsync(name);
  },
  setItem: async (name: string, value: string): Promise<void> => {
    await SecureStore.setItemAsync(name, value);
  },
  removeItem: async (name: string): Promise<void> => {
    await SecureStore.deleteItemAsync(name);
  },
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // State
      user: null,
      accessToken: null,
      refreshToken: null,
      isLoading: false,
      isAuthenticated: false,

      // Actions
      setUser: (user) => set({ user, isAuthenticated: true }),

      setTokens: (accessToken, refreshToken) =>
        set({ accessToken, refreshToken }),

      loginWithInstagram: async (code: string, redirectUri: string) => {
        set({ isLoading: true });
        try {
          const response = await authApi.loginWithInstagram(code, redirectUri);

          // Store tokens securely
          await SecureStore.setItemAsync('accessToken', response.accessToken);
          await SecureStore.setItemAsync('refreshToken', response.refreshToken);

          set({
            user: response.user,
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
            isAuthenticated: true,
          });

          return response;
        } catch (error) {
          console.error('Login failed:', error);
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      logout: () => {
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        });
      },

      refreshAuth: async () => {
        const { refreshToken } = get();
        if (!refreshToken) {
          get().logout();
          return;
        }

        try {
          const response = await authApi.refresh(refreshToken);

          await SecureStore.setItemAsync('accessToken', response.accessToken);
          await SecureStore.setItemAsync('refreshToken', response.refreshToken);

          set({
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
          });
        } catch (error) {
          console.error('Token refresh failed:', error);
          get().logout();
        }
      },

      initializeAuth: async () => {
        set({ isLoading: true });
        try {
          // Check for stored tokens
          const accessToken = await SecureStore.getItemAsync('accessToken');
          const refreshToken = await SecureStore.getItemAsync('refreshToken');

          if (!accessToken || !refreshToken) {
            set({ isLoading: false, isAuthenticated: false });
            return;
          }

          // Set tokens and try to get current user
          set({ accessToken, refreshToken });

          try {
            // Validate token by fetching current user
            const user = await authApi.getMe();
            set({
              user,
              isAuthenticated: true,
              isLoading: false,
            });
          } catch (error) {
            // Token might be expired, try to refresh
            try {
              const response = await authApi.refresh(refreshToken);
              await SecureStore.setItemAsync('accessToken', response.accessToken);
              await SecureStore.setItemAsync('refreshToken', response.refreshToken);

              // Get user with new token
              const user = await authApi.getMe();
              set({
                user,
                accessToken: response.accessToken,
                refreshToken: response.refreshToken,
                isAuthenticated: true,
                isLoading: false,
              });
            } catch (refreshError) {
              // Refresh failed, clear everything
              console.error('Auth initialization failed:', refreshError);
              await SecureStore.deleteItemAsync('accessToken');
              await SecureStore.deleteItemAsync('refreshToken');
              set({
                user: null,
                accessToken: null,
                refreshToken: null,
                isAuthenticated: false,
                isLoading: false,
              });
            }
          }
        } catch (error) {
          console.error('Auth initialization error:', error);
          set({ isLoading: false, isAuthenticated: false });
        }
      },
    }),
    {
      name: 'checkpoint-auth',
      storage: createJSONStorage(() => secureStorage),
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
