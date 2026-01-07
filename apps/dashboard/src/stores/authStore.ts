'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Organizer {
  id: string;
  email: string;
  name: string;
  companyName: string | null;
}

interface AuthState {
  organizer: Organizer | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (token: string, organizer: Organizer) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      organizer: null,
      token: null,
      isAuthenticated: false,

      setAuth: (token, organizer) => {
        localStorage.setItem('organizer_token', token);
        set({ token, organizer, isAuthenticated: true });
      },

      logout: () => {
        localStorage.removeItem('organizer_token');
        set({ token: null, organizer: null, isAuthenticated: false });
      },
    }),
    {
      name: 'checkpoint-organizer-auth',
      partialize: (state) => ({
        organizer: state.organizer,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
