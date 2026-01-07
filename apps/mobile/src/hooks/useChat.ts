import { useEffect, useCallback, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import * as SecureStore from 'expo-secure-store';

import { WS_URL } from '../services/api';
import { useAuthStore } from '../stores/authStore';

interface Message {
  id: string;
  matchId: string;
  senderId: string;
  content: string;
  isOwn: boolean;
  readAt: string | null;
  createdAt: string;
}

interface MatchRevealEvent {
  matchId: string;
  interactionType: string;
  eventName: string;
  otherUser: {
    id: string;
    name: string;
    profilePicture: string | null;
  };
}

interface TypingEvent {
  matchId: string;
  userId: string;
  isTyping: boolean;
}

interface MessagesReadEvent {
  matchId: string;
  readBy: string;
  lastMessageId: string;
}

interface RematchRequestEvent {
  requestId: string;
  eventName: string;
}

interface RematchAcceptedEvent {
  requestId: string;
  matchId: string;
  eventName: string;
  user: {
    name: string;
    profilePicture: string | null;
  };
}

interface UseChatOptions {
  onNewMessage?: (message: Message) => void;
  onMatchRevealed?: (data: MatchRevealEvent) => void;
  onTyping?: (data: TypingEvent) => void;
  onMessagesRead?: (data: MessagesReadEvent) => void;
  onUnreadUpdate?: (data: { matchId: string }) => void;
  onRematchRequest?: (data: RematchRequestEvent) => void;
  onRematchAccepted?: (data: RematchAcceptedEvent) => void;
}

export function useChat(options: UseChatOptions = {}) {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const { isAuthenticated } = useAuthStore();

  const connect = useCallback(async () => {
    if (socketRef.current?.connected || isConnecting) {
      return;
    }

    setIsConnecting(true);

    try {
      const token = await SecureStore.getItemAsync('accessToken');

      if (!token) {
        console.warn('No access token for WebSocket connection');
        setIsConnecting(false);
        return;
      }

      const socket = io(`${WS_URL}/chat`, {
        auth: { token },
        transports: ['websocket'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      socket.on('connect', () => {
        console.log('Chat WebSocket connected');
        setIsConnected(true);
        setIsConnecting(false);
      });

      socket.on('disconnect', (reason) => {
        console.log('Chat WebSocket disconnected:', reason);
        setIsConnected(false);
      });

      socket.on('connect_error', (error) => {
        console.error('Chat WebSocket connection error:', error);
        setIsConnecting(false);
      });

      // Event handlers
      socket.on('new_message', (message: Message) => {
        options.onNewMessage?.(message);
      });

      socket.on('match_revealed', (data: MatchRevealEvent) => {
        options.onMatchRevealed?.(data);
      });

      socket.on('typing', (data: TypingEvent) => {
        options.onTyping?.(data);
      });

      socket.on('messages_read', (data: MessagesReadEvent) => {
        options.onMessagesRead?.(data);
      });

      socket.on('unread_update', (data: { matchId: string }) => {
        options.onUnreadUpdate?.(data);
      });

      socket.on('rematch_request', (data: RematchRequestEvent) => {
        options.onRematchRequest?.(data);
      });

      socket.on('rematch_accepted', (data: RematchAcceptedEvent) => {
        options.onRematchAccepted?.(data);
      });

      socket.on('match_created', (data: MatchRevealEvent) => {
        options.onMatchRevealed?.(data);
      });

      socketRef.current = socket;
    } catch (error) {
      console.error('Failed to connect chat WebSocket:', error);
      setIsConnecting(false);
    }
  }, [options, isConnecting]);

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
      setIsConnected(false);
    }
  }, []);

  const sendMessage = useCallback(
    async (matchId: string, content: string): Promise<{ success: boolean; message?: Message; error?: string }> => {
      if (!socketRef.current?.connected) {
        return { success: false, error: 'Not connected' };
      }

      return new Promise((resolve) => {
        socketRef.current!.emit(
          'send_message',
          { matchId, content },
          (response: { success: boolean; message?: Message; error?: string }) => {
            resolve(response);
          }
        );
      });
    },
    []
  );

  const markAsRead = useCallback(async (matchId: string, lastMessageId: string) => {
    if (!socketRef.current?.connected) {
      return;
    }

    socketRef.current.emit('mark_read', { matchId, lastMessageId });
  }, []);

  const setTyping = useCallback((matchId: string, isTyping: boolean) => {
    if (!socketRef.current?.connected) {
      return;
    }

    socketRef.current.emit('typing', { matchId, isTyping });
  }, []);

  const joinMatch = useCallback(async (matchId: string): Promise<boolean> => {
    if (!socketRef.current?.connected) {
      return false;
    }

    return new Promise((resolve) => {
      socketRef.current!.emit(
        'join_match',
        { matchId },
        (response: { success: boolean }) => {
          resolve(response.success);
        }
      );
    });
  }, []);

  // Auto-connect when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      connect();
    } else {
      disconnect();
    }

    return () => {
      disconnect();
    };
  }, [isAuthenticated, connect, disconnect]);

  return {
    isConnected,
    isConnecting,
    connect,
    disconnect,
    sendMessage,
    markAsRead,
    setTyping,
    joinMatch,
  };
}

export default useChat;
