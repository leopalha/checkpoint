import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

export const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

// Base URL without /api/v1 for WebSocket connections
export const WS_URL = API_URL.replace('/api/v1', '');

export const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 and not already retrying
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = await SecureStore.getItemAsync('refreshToken');
        if (!refreshToken) {
          throw new Error('No refresh token');
        }

        const response = await axios.post(`${API_URL}/auth/refresh`, {
          refreshToken,
        });

        const { accessToken, refreshToken: newRefreshToken } = response.data;

        await SecureStore.setItemAsync('accessToken', accessToken);
        await SecureStore.setItemAsync('refreshToken', newRefreshToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Clear tokens - AuthProvider will detect this and redirect to login
        await SecureStore.deleteItemAsync('accessToken');
        await SecureStore.deleteItemAsync('refreshToken');
        // Emit event for auth state change detection
        // The auth store will pick this up and redirect
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('auth:logout'));
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  loginWithInstagram: async (code: string, redirectUri: string) => {
    const response = await api.post('/auth/instagram', { code, redirectUri });
    return response.data;
  },

  refresh: async (refreshToken: string) => {
    const response = await api.post('/auth/refresh', { refreshToken });
    return response.data;
  },

  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

// Users API
export const usersApi = {
  updateProfile: async (data: { bio?: string; defaultIntentions?: string[] }) => {
    const response = await api.patch('/users/me', data);
    return response.data;
  },

  uploadProfilePicture: async (imageUri: string): Promise<{ url: string }> => {
    const formData = new FormData();

    // Get file extension and mime type
    const uriParts = imageUri.split('.');
    const fileType = uriParts[uriParts.length - 1];

    formData.append('file', {
      uri: imageUri,
      name: `profile.${fileType}`,
      type: `image/${fileType}`,
    } as unknown as Blob);

    const token = await SecureStore.getItemAsync('accessToken');
    const response = await axios.post(`${API_URL}/uploads/profile-picture`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  exportData: async () => {
    const response = await api.get('/users/me/export');
    return response.data;
  },

  deleteAccount: async () => {
    const response = await api.delete('/users/me');
    return response.data;
  },

  cancelDeletion: async () => {
    const response = await api.post('/users/me/cancel-deletion');
    return response.data;
  },

  getPreferences: async () => {
    const response = await api.get('/users/me/preferences');
    return response.data;
  },

  updatePreferences: async (data: { notificationsEnabled?: boolean; locationEnabled?: boolean }) => {
    const response = await api.patch('/users/me/preferences', data);
    return response.data;
  },
};

export default api;
