'use client';

import { io, Socket } from 'socket.io-client';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    const token = typeof window !== 'undefined' ? localStorage.getItem('organizer_token') : null;

    socket = io(API_URL, {
      autoConnect: false,
      auth: {
        token,
      },
      transports: ['websocket', 'polling'],
    });

    socket.on('connect', () => {
      console.log('Socket connected:', socket?.id);
    });

    socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error.message);
    });
  }

  return socket;
}

export function connectSocket(): void {
  const s = getSocket();
  if (!s.connected) {
    s.connect();
  }
}

export function disconnectSocket(): void {
  if (socket?.connected) {
    socket.disconnect();
  }
}

export function joinEventRoom(eventId: string): void {
  const s = getSocket();
  s.emit('organizer:join-event', { eventId });
}

export function leaveEventRoom(eventId: string): void {
  const s = getSocket();
  s.emit('organizer:leave-event', { eventId });
}

// Event types for dashboard real-time updates
export interface PresenceUpdate {
  eventId: string;
  userId: string;
  userName: string;
  userPicture: string | null;
  action: 'confirmed' | 'checked_in' | 'checked_out';
  timestamp: string;
}

export interface MatchUpdate {
  eventId: string;
  matchType: string;
  user1Name: string;
  user2Name: string;
  timestamp: string;
}

export interface EventStats {
  eventId: string;
  totalConfirmed: number;
  totalCheckedIn: number;
  totalMatches: number;
  totalInteractions: number;
}

export function onPresenceUpdate(callback: (data: PresenceUpdate) => void): () => void {
  const s = getSocket();
  s.on('presence:update', callback);
  return () => s.off('presence:update', callback);
}

export function onMatchCreated(callback: (data: MatchUpdate) => void): () => void {
  const s = getSocket();
  s.on('match:created', callback);
  return () => s.off('match:created', callback);
}

export function onEventStats(callback: (data: EventStats) => void): () => void {
  const s = getSocket();
  s.on('event:stats', callback);
  return () => s.off('event:stats', callback);
}
