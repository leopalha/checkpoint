import {
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
  Image,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, Stack } from 'expo-router';

import { api } from '../../services/api';
import { useChat } from '../../hooks/useChat';

interface Message {
  id: string;
  matchId: string;
  senderId: string;
  content: string;
  isOwn: boolean;
  readAt: string | null;
  createdAt: string;
}

interface ConversationDetails {
  match: {
    id: string;
    interactionType: string;
    expiresAt: string | null;
  };
  otherUser: {
    id: string;
    name: string;
    instagramUsername: string;
    profilePicture: string | null;
  };
  event: {
    id: string;
    name: string;
  };
}

const INTERACTION_EMOJIS: Record<string, string> = {
  fire: '🔥',
  handshake: '🤝',
  highfive: '✋',
  carona: '🚗',
  ticket: '🎟️',
  champagne: '🍾',
  briefcase: '💼',
  target: '🎯',
};

function formatTime(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatExpiryTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  if (diffMs <= 0) return 'Expirado';
  if (diffDays > 0) return `${diffDays}d ${diffHours}h`;
  if (diffHours > 0) return `${diffHours}h`;
  return 'Expira em breve';
}

export default function ChatScreen() {
  const { matchId } = useLocalSearchParams<{ matchId: string }>();
  const flatListRef = useRef<FlatList>(null);

  const [conversation, setConversation] = useState<ConversationDetails | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [inputText, setInputText] = useState('');
  const [otherTyping, setOtherTyping] = useState(false);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastTypingRef = useRef(false);

  // Check if chat is expired
  const isExpired = useMemo(() => {
    if (!conversation?.match.expiresAt) return false;
    return new Date(conversation.match.expiresAt) <= new Date();
  }, [conversation?.match.expiresAt]);

  // Use the shared WebSocket hook
  const { isConnected, sendMessage: sendSocketMessage, markAsRead, setTyping, joinMatch } = useChat({
    onNewMessage: (message) => {
      if (message.matchId === matchId) {
        setMessages((prev) => [...prev, message]);
        // Mark as read if it's from the other user
        if (!message.isOwn) {
          markAsRead(matchId!, message.id);
        }
      }
    },
    onTyping: (data) => {
      if (data.matchId === matchId && data.userId === conversation?.otherUser.id) {
        setOtherTyping(data.isTyping);
      }
    },
    onMessagesRead: (data) => {
      if (data.matchId === matchId) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.isOwn && !msg.readAt
              ? { ...msg, readAt: new Date().toISOString() }
              : msg,
          ),
        );
      }
    },
  });

  // Fetch conversation details
  const fetchConversation = useCallback(async () => {
    try {
      const response = await api.get(`/chat/conversations/${matchId}`);
      setConversation(response.data);
    } catch (error) {
      console.error('Failed to fetch conversation:', error);
    }
  }, [matchId]);

  // Fetch messages
  const fetchMessages = useCallback(async () => {
    try {
      const response = await api.get(`/chat/messages/${matchId}`);
      setMessages(response.data.reverse()); // API returns newest first, we want oldest first
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    } finally {
      setLoading(false);
    }
  }, [matchId]);

  // Initial load and join match room
  useEffect(() => {
    fetchConversation();
    fetchMessages();
  }, [fetchConversation, fetchMessages]);

  // Join match room when connected
  useEffect(() => {
    if (isConnected && matchId) {
      joinMatch(matchId);
    }
  }, [isConnected, matchId, joinMatch]);

  // Mark messages as read when opening
  useEffect(() => {
    if (messages.length > 0 && isConnected) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage && !lastMessage.isOwn && !lastMessage.readAt) {
        markAsRead(matchId!, lastMessage.id);
      }
    }
  }, [messages, matchId, isConnected, markAsRead]);

  // Handle typing indicator with debounce
  useEffect(() => {
    if (!isConnected || !matchId) return;

    const shouldType = inputText.length > 0;

    if (shouldType !== lastTypingRef.current) {
      lastTypingRef.current = shouldType;
      setTyping(matchId, shouldType);

      // Clear typing after 3 seconds of no input
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      if (shouldType) {
        typingTimeoutRef.current = setTimeout(() => {
          if (lastTypingRef.current) {
            lastTypingRef.current = false;
            setTyping(matchId, false);
          }
        }, 3000);
      }
    }

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [inputText, isConnected, matchId, setTyping]);

  const handleSendMessage = async () => {
    if (!inputText.trim() || sending || isExpired) return;

    const content = inputText.trim();
    setInputText('');
    setSending(true);

    // Stop typing indicator
    if (lastTypingRef.current) {
      lastTypingRef.current = false;
      setTyping(matchId!, false);
    }

    try {
      if (isConnected) {
        const result = await sendSocketMessage(matchId!, content);
        if (!result.success) {
          throw new Error(result.error || 'Failed to send message');
        }
      } else {
        // Fallback to REST API
        const response = await api.post('/chat/messages', {
          matchId,
          content,
        });
        setMessages((prev) => [...prev, response.data]);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      setInputText(content); // Restore message on failure
    } finally {
      setSending(false);
    }
  };

  const renderMessage = ({ item, index }: { item: Message; index: number }) => {
    const prevMessage = index > 0 ? messages[index - 1] : null;
    const showDate =
      index === 0 ||
      (prevMessage && new Date(item.createdAt).toDateString() !==
        new Date(prevMessage.createdAt).toDateString());

    return (
      <View>
        {showDate && (
          <View className="items-center my-4">
            <Text className="text-gray-400 text-sm bg-gray-100 px-3 py-1 rounded-full">
              {new Date(item.createdAt).toLocaleDateString('pt-BR', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
              })}
            </Text>
          </View>
        )}
        <View
          className={`flex-row mb-2 ${item.isOwn ? 'justify-end' : 'justify-start'}`}
        >
          <View
            className={`max-w-[80%] px-4 py-3 rounded-2xl ${
              item.isOwn
                ? 'bg-violet-600 rounded-br-sm'
                : 'bg-gray-100 rounded-bl-sm'
            }`}
          >
            <Text className={item.isOwn ? 'text-white' : 'text-gray-900'}>
              {item.content}
            </Text>
            <View className="flex-row items-center justify-end mt-1 gap-1">
              <Text
                className={`text-xs ${
                  item.isOwn ? 'text-violet-200' : 'text-gray-400'
                }`}
              >
                {formatTime(item.createdAt)}
              </Text>
              {item.isOwn && (
                <Text className="text-xs text-violet-200">
                  {item.readAt ? '✓✓' : '✓'}
                </Text>
              )}
            </View>
          </View>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#7C3AED" />
      </SafeAreaView>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: () => (
            <Pressable
              className="flex-row items-center"
              onPress={() => {
                // Could navigate to profile
              }}
            >
              {conversation?.otherUser.profilePicture ? (
                <Image
                  source={{ uri: conversation.otherUser.profilePicture }}
                  className="w-9 h-9 rounded-full mr-3"
                />
              ) : (
                <View className="w-9 h-9 rounded-full bg-gray-200 items-center justify-center mr-3">
                  <Text className="text-lg">👤</Text>
                </View>
              )}
              <View>
                <Text className="font-semibold text-gray-900">
                  {conversation?.otherUser.name}
                </Text>
                <Text className="text-xs text-gray-500">
                  {INTERACTION_EMOJIS[conversation?.match.interactionType || ''] || '💜'}{' '}
                  {conversation?.event.name}
                </Text>
              </View>
            </Pressable>
          ),
          headerBackTitle: 'Voltar',
          headerRight: () =>
            conversation?.match.expiresAt && (
              <View className={`px-2 py-1 rounded-full ${isExpired ? 'bg-red-100' : 'bg-orange-100'}`}>
                <Text className={`text-xs font-medium ${isExpired ? 'text-red-700' : 'text-orange-700'}`}>
                  {formatExpiryTime(conversation.match.expiresAt)}
                </Text>
              </View>
            ),
        }}
      />
      <KeyboardAvoidingView
        className="flex-1 bg-white"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={90}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          contentContainerStyle={{ padding: 16, flexGrow: 1 }}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: true })
          }
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center">
              <Text className="text-4xl mb-4">
                {INTERACTION_EMOJIS[conversation?.match.interactionType || ''] || '💜'}
              </Text>
              <Text className="text-gray-900 font-semibold text-lg mb-2">
                Match com {conversation?.otherUser.name}!
              </Text>
              <Text className="text-gray-500 text-center px-8">
                Vocês deram match no evento {conversation?.event.name}.
                {'\n'}Comece a conversa!
              </Text>
            </View>
          }
          ListFooterComponent={
            otherTyping ? (
              <View className="flex-row items-center px-2 py-1">
                <View className="bg-gray-100 px-4 py-2 rounded-2xl rounded-bl-sm">
                  <Text className="text-gray-500">digitando...</Text>
                </View>
              </View>
            ) : null
          }
        />

        {/* Expiry Warning */}
        {isExpired && (
          <View className="bg-red-50 px-4 py-3 border-t border-red-100">
            <Text className="text-red-700 text-center text-sm">
              Esta conversa expirou. Vocês podem continuar no Instagram: @{conversation?.otherUser.instagramUsername}
            </Text>
          </View>
        )}

        {/* Input Area */}
        <View className="flex-row items-end px-4 py-3 border-t border-gray-100 bg-white">
          <TextInput
            className={`flex-1 bg-gray-100 rounded-2xl px-4 py-3 max-h-24 text-gray-900 ${isExpired ? 'opacity-50' : ''}`}
            placeholder={isExpired ? 'Conversa expirada' : 'Digite uma mensagem...'}
            placeholderTextColor="#9CA3AF"
            value={inputText}
            onChangeText={setInputText}
            multiline
            onSubmitEditing={handleSendMessage}
            editable={!isExpired}
          />
          <Pressable
            className={`ml-2 w-12 h-12 rounded-full items-center justify-center ${
              inputText.trim() && !sending && !isExpired ? 'bg-violet-600' : 'bg-gray-200'
            }`}
            onPress={handleSendMessage}
            disabled={!inputText.trim() || sending || isExpired}
          >
            {sending ? (
              <ActivityIndicator size="small" color="#7C3AED" />
            ) : (
              <Text className="text-xl">
                {inputText.trim() && !isExpired ? '➤' : ''}
              </Text>
            )}
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </>
  );
}
