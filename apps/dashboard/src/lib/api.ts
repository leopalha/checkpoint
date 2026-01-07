import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

export const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('organizer_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('organizer_token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const organizerApi = {
  register: async (data: {
    email: string;
    password: string;
    name: string;
    companyName?: string;
  }) => {
    const response = await api.post('/organizers/register', data);
    return response.data;
  },

  login: async (data: { email: string; password: string }) => {
    const response = await api.post('/organizers/login', data);
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/organizers/me');
    return response.data;
  },

  updateProfile: async (data: { name?: string; companyName?: string }) => {
    const response = await api.patch('/organizers/me', data);
    return response.data;
  },

  changePassword: async (data: { currentPassword: string; newPassword: string }) => {
    const response = await api.post('/organizers/me/change-password', data);
    return response.data;
  },
};

// Events API
export const eventsApi = {
  getMyEvents: async () => {
    const response = await api.get('/organizers/events');
    return response.data;
  },

  getEvent: async (eventId: string) => {
    const response = await api.get(`/organizers/events/${eventId}`);
    return response.data;
  },

  getEventById: async (eventId: string) => {
    const response = await api.get(`/organizers/events/${eventId}`);
    return response.data;
  },

  getEventStats: async (eventId: string) => {
    const response = await api.get(`/organizers/events/${eventId}/stats`);
    return response.data;
  },

  createEvent: async (data: {
    name: string;
    description?: string;
    imageUrl?: string;
    startDate: string;
    endDate: string;
    locationName: string;
    locationAddress: string;
    latitude: number;
    longitude: number;
    themeId?: string;
    allowedInteractions?: string[];
    gpsRadius?: number;
  }) => {
    const response = await api.post('/organizers/events', data);
    return response.data;
  },

  updateEvent: async (eventId: string, data: Partial<{
    name: string;
    description: string;
    imageUrl: string;
    startDate: string;
    endDate: string;
    locationName: string;
    locationAddress: string;
    latitude: number;
    longitude: number;
    themeId: string;
    allowedInteractions: string[];
    gpsRadius: number;
  }>) => {
    const response = await api.patch(`/organizers/events/${eventId}`, data);
    return response.data;
  },

  deleteEvent: async (eventId: string) => {
    const response = await api.delete(`/organizers/events/${eventId}`);
    return response.data;
  },

  regenerateQRCode: async (eventId: string) => {
    const response = await api.post(`/organizers/events/${eventId}/regenerate-qr`);
    return response.data;
  },

  getAttendees: async (eventId: string) => {
    const response = await api.get(`/organizers/events/${eventId}/attendees`);
    return response.data;
  },
};

export default api;
