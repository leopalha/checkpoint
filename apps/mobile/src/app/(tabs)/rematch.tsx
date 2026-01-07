import {
  View,
  Text,
  FlatList,
  Pressable,
  Image,
  RefreshControl,
  ActivityIndicator,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { rematchApi } from '../../services/api';
import { useChat } from '../../hooks/useChat';

interface RematchUser {
  id: string;
  name: string;
  instagramUsername: string;
  profilePicture: string | null;
  bio: string | null;
  requestSent?: boolean;
}

interface RematchEvent {
  id: string;
  name: string;
  locationName: string;
  startDate: string;
  endDate: string;
}

interface RematchRequest {
  id: string;
  fromUserId: string;
  toUserId: string;
  eventId: string;
  message: string | null;
  status: string;
  createdAt: string;
  respondedAt: string | null;
  expiresAt: string;
  otherUser: RematchUser;
  event: RematchEvent;
}

interface AvailableEvent {
  event: RematchEvent;
  users: RematchUser[];
}

type TabType = 'requests' | 'available' | 'connections';

function formatTimeAgo(date: string): string {
  const now = new Date();
  const then = new Date(date);
  const diffMs = now.getTime() - then.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 0) return `${diffDays}d atrás`;
  if (diffHours > 0) return `${diffHours}h atrás`;
  return 'Agora';
}

function formatEventDate(date: string): string {
  const d = new Date(date);
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
}

export default function RematchScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('requests');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [processing, setProcessing] = useState<string | null>(null);

  // Data states
  const [pendingRequests, setPendingRequests] = useState<RematchRequest[]>([]);
  const [sentRequests, setSentRequests] = useState<RematchRequest[]>([]);
  const [availableEvents, setAvailableEvents] = useState<AvailableEvent[]>([]);
  const [connections, setConnections] = useState<RematchRequest[]>([]);
  const [stats, setStats] = useState({ remainingToday: 10, dailyLimit: 10 });

  // Send request modal
  const [sendModalVisible, setSendModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<RematchUser | null>(null);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [sendMessage, setSendMessage] = useState('');

  const fetchRequests = useCallback(async () => {
    try {
      const [requestsData, statsData] = await Promise.all([
        rematchApi.getRequests(),
        rematchApi.getStats(),
      ]);
      setPendingRequests(requestsData.pending || []);
      setSentRequests(requestsData.sent || []);
      setStats(statsData);
    } catch (error) {
      console.error('Failed to fetch requests:', error);
    }
  }, []);

  const fetchAvailable = useCallback(async () => {
    try {
      const data = await rematchApi.getAvailable();
      setAvailableEvents(data.events || []);
      setStats({ remainingToday: data.remainingToday, dailyLimit: data.dailyLimit });
    } catch (error) {
      console.error('Failed to fetch available:', error);
    }
  }, []);

  const fetchConnections = useCallback(async () => {
    try {
      const data = await rematchApi.getConnections();
      setConnections(data.connections || []);
    } catch (error) {
      console.error('Failed to fetch connections:', error);
    }
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      await Promise.all([fetchRequests(), fetchAvailable(), fetchConnections()]);
    } finally {
      setLoading(false);
    }
  }, [fetchRequests, fetchAvailable, fetchConnections]);

  // Real-time updates
  useChat({
    onRematchRequest: () => fetchRequests(),
    onRematchAccepted: () => {
      fetchRequests();
      fetchConnections();
    },
  });

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const handleAccept = async (request: RematchRequest) => {
    try {
      setProcessing(request.id);
      await rematchApi.acceptRequest(request.id);
      Alert.alert(
        'ReMatch!',
        `Você e ${request.otherUser.name} agora estão conectados!`,
        [
          {
            text: 'Ver Chat',
            onPress: () => {
              // Navigate to chat - the connection creates a match
              fetchData();
            },
          },
          { text: 'Fechar', style: 'cancel', onPress: () => fetchData() },
        ]
      );
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      Alert.alert('Erro', err.response?.data?.message || 'Erro ao aceitar solicitação');
    } finally {
      setProcessing(null);
    }
  };

  const handleIgnore = async (request: RematchRequest) => {
    Alert.alert(
      'Ignorar solicitação',
      `Tem certeza que deseja ignorar a solicitação de ${request.otherUser.name}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Ignorar',
          style: 'destructive',
          onPress: async () => {
            try {
              setProcessing(request.id);
              await rematchApi.ignoreRequest(request.id);
              await fetchRequests();
            } catch (error) {
              Alert.alert('Erro', 'Erro ao ignorar solicitação');
            } finally {
              setProcessing(null);
            }
          },
        },
      ]
    );
  };

  const handleSendRequest = async () => {
    if (!selectedUser || !selectedEventId) return;

    try {
      setProcessing('send');
      await rematchApi.sendRequest(selectedUser.id, selectedEventId, sendMessage || undefined);
      setSendModalVisible(false);
      setSelectedUser(null);
      setSelectedEventId(null);
      setSendMessage('');
      Alert.alert('Sucesso!', 'Solicitação de ReMatch enviada!');
      await fetchData();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      Alert.alert('Erro', err.response?.data?.message || 'Erro ao enviar solicitação');
    } finally {
      setProcessing(null);
    }
  };

  const openSendModal = (user: RematchUser, eventId: string) => {
    setSelectedUser(user);
    setSelectedEventId(eventId);
    setSendModalVisible(true);
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" color="#7C3AED" />
      </SafeAreaView>
    );
  }

  const renderTabs = () => (
    <View className="flex-row bg-white border-b border-gray-100 px-4 py-2">
      {[
        { key: 'requests', label: 'Solicitações', count: pendingRequests.length },
        { key: 'available', label: 'Para Conectar', count: null },
        { key: 'connections', label: 'Conexões', count: connections.length },
      ].map((tab) => (
        <Pressable
          key={tab.key}
          className={`flex-1 py-3 rounded-full mx-1 ${
            activeTab === tab.key ? 'bg-violet-600' : 'bg-gray-100'
          }`}
          onPress={() => setActiveTab(tab.key as TabType)}
        >
          <View className="flex-row items-center justify-center gap-1">
            <Text
              className={`font-medium text-center ${
                activeTab === tab.key ? 'text-white' : 'text-gray-600'
              }`}
            >
              {tab.label}
            </Text>
            {tab.count !== null && tab.count > 0 && (
              <View className={`w-5 h-5 rounded-full items-center justify-center ${
                activeTab === tab.key ? 'bg-white/30' : 'bg-violet-600'
              }`}>
                <Text className={`text-xs font-bold ${
                  activeTab === tab.key ? 'text-white' : 'text-white'
                }`}>{tab.count}</Text>
              </View>
            )}
          </View>
        </Pressable>
      ))}
    </View>
  );

  const renderRequestItem = ({ item }: { item: RematchRequest }) => (
    <View className="bg-white rounded-2xl p-4 shadow-sm mb-3">
      <View className="flex-row items-center">
        {item.otherUser.profilePicture ? (
          <Image
            source={{ uri: item.otherUser.profilePicture }}
            className="w-16 h-16 rounded-full"
          />
        ) : (
          <View className="w-16 h-16 rounded-full bg-violet-100 items-center justify-center">
            <Text className="text-2xl">👤</Text>
          </View>
        )}
        <View className="flex-1 ml-4">
          <Text className="text-lg font-semibold text-gray-900">
            {item.otherUser.name}
          </Text>
          <Text className="text-gray-500">@{item.otherUser.instagramUsername}</Text>
          <Text className="text-violet-600 text-sm mt-1">
            📍 {item.event.name}
          </Text>
        </View>
        <Text className="text-gray-400 text-sm">{formatTimeAgo(item.createdAt)}</Text>
      </View>

      {item.message && (
        <View className="bg-gray-50 rounded-xl p-3 mt-3">
          <Text className="text-gray-700 italic">"{item.message}"</Text>
        </View>
      )}

      <View className="flex-row gap-3 mt-4">
        <Pressable
          className="flex-1 bg-gray-100 py-3 rounded-xl"
          onPress={() => handleIgnore(item)}
          disabled={processing === item.id}
        >
          <Text className="text-gray-700 font-medium text-center">Ignorar</Text>
        </Pressable>
        <Pressable
          className="flex-1 bg-violet-600 py-3 rounded-xl"
          onPress={() => handleAccept(item)}
          disabled={processing === item.id}
        >
          {processing === item.id ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <Text className="text-white font-medium text-center">Aceitar</Text>
          )}
        </Pressable>
      </View>
    </View>
  );

  const renderAvailableEvent = ({ item }: { item: AvailableEvent }) => (
    <View className="mb-6">
      <View className="flex-row items-center mb-3 px-1">
        <View className="bg-violet-100 px-3 py-1 rounded-full">
          <Text className="text-violet-700 font-medium">
            {formatEventDate(item.event.endDate)}
          </Text>
        </View>
        <Text className="flex-1 ml-2 text-gray-900 font-semibold" numberOfLines={1}>
          {item.event.name}
        </Text>
      </View>

      {item.users.map((user) => (
        <View
          key={user.id}
          className="bg-white rounded-2xl p-4 shadow-sm mb-2 flex-row items-center"
        >
          {user.profilePicture ? (
            <Image
              source={{ uri: user.profilePicture }}
              className="w-14 h-14 rounded-full"
            />
          ) : (
            <View className="w-14 h-14 rounded-full bg-violet-100 items-center justify-center">
              <Text className="text-xl">👤</Text>
            </View>
          )}
          <View className="flex-1 ml-3">
            <Text className="text-gray-900 font-semibold">{user.name}</Text>
            <Text className="text-gray-500 text-sm">@{user.instagramUsername}</Text>
          </View>
          {user.requestSent ? (
            <View className="bg-gray-100 px-4 py-2 rounded-full">
              <Text className="text-gray-500 font-medium">Enviado</Text>
            </View>
          ) : (
            <Pressable
              className="bg-violet-600 px-4 py-2 rounded-full"
              onPress={() => openSendModal(user, item.event.id)}
            >
              <Text className="text-white font-medium">Conectar</Text>
            </Pressable>
          )}
        </View>
      ))}
    </View>
  );

  const renderConnectionItem = ({ item }: { item: { user: RematchUser; event: RematchEvent; connectedAt: string; matchId?: string } }) => (
    <Pressable
      className="bg-white rounded-2xl p-4 shadow-sm mb-3 flex-row items-center"
      onPress={() => item.matchId && router.push(`/chat/${item.matchId}`)}
    >
      {item.user.profilePicture ? (
        <Image
          source={{ uri: item.user.profilePicture }}
          className="w-14 h-14 rounded-full"
        />
      ) : (
        <View className="w-14 h-14 rounded-full bg-violet-100 items-center justify-center">
          <Text className="text-xl">👤</Text>
        </View>
      )}
      <View className="flex-1 ml-3">
        <Text className="text-gray-900 font-semibold">{item.user.name}</Text>
        <Text className="text-gray-500 text-sm">@{item.user.instagramUsername}</Text>
        <Text className="text-violet-600 text-sm mt-1">
          🔄 {item.event.name}
        </Text>
      </View>
      <View className="items-end">
        <Text className="text-gray-400 text-sm">{formatTimeAgo(item.connectedAt)}</Text>
        {item.matchId && (
          <Text className="text-violet-600 text-sm mt-1">💬 Chat</Text>
        )}
      </View>
    </Pressable>
  );

  const renderEmptyState = () => {
    if (activeTab === 'requests') {
      return (
        <View className="flex-1 items-center justify-center py-20">
          <Text className="text-6xl mb-4">📬</Text>
          <Text className="text-xl font-semibold text-gray-900 mb-2">
            Nenhuma solicitação
          </Text>
          <Text className="text-gray-500 text-center px-8">
            Quando alguém quiser conectar com você após um evento, aparecerá aqui.
          </Text>
        </View>
      );
    }

    if (activeTab === 'available') {
      return (
        <View className="flex-1 items-center justify-center py-20">
          <Text className="text-6xl mb-4">🎉</Text>
          <Text className="text-xl font-semibold text-gray-900 mb-2">
            Nenhum evento recente
          </Text>
          <Text className="text-gray-500 text-center px-8">
            Faça check-in em eventos para poder conectar com pessoas depois!
          </Text>
        </View>
      );
    }

    return (
      <View className="flex-1 items-center justify-center py-20">
        <Text className="text-6xl mb-4">🤝</Text>
        <Text className="text-xl font-semibold text-gray-900 mb-2">
          Nenhuma conexão ainda
        </Text>
        <Text className="text-gray-500 text-center px-8">
          Conexões feitas através do ReMatch aparecerão aqui.
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="px-6 py-4 bg-white border-b border-gray-100">
        <View className="flex-row items-center justify-between">
          <Text className="text-2xl font-bold text-gray-900">ReMatch</Text>
          <View className="bg-violet-100 px-3 py-1 rounded-full">
            <Text className="text-violet-700 font-medium">
              {stats.remainingToday}/{stats.dailyLimit} restantes
            </Text>
          </View>
        </View>
        <Text className="text-gray-500 mt-1">
          Conecte com pessoas de eventos recentes
        </Text>
      </View>

      {/* Tabs */}
      {renderTabs()}

      {/* Content */}
      {activeTab === 'requests' && (
        <FlatList
          data={pendingRequests}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16, flexGrow: 1 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#7C3AED']} />
          }
          renderItem={renderRequestItem}
          ListEmptyComponent={renderEmptyState}
          ListHeaderComponent={
            sentRequests.length > 0 ? (
              <View className="mb-4">
                <Text className="text-gray-500 font-medium mb-2">
                  Enviadas ({sentRequests.length})
                </Text>
                {sentRequests.map((req) => (
                  <View key={req.id} className="bg-gray-100 rounded-xl p-3 mb-2 flex-row items-center">
                    {req.otherUser.profilePicture ? (
                      <Image
                        source={{ uri: req.otherUser.profilePicture }}
                        className="w-10 h-10 rounded-full"
                      />
                    ) : (
                      <View className="w-10 h-10 rounded-full bg-gray-200 items-center justify-center">
                        <Text>👤</Text>
                      </View>
                    )}
                    <View className="flex-1 ml-3">
                      <Text className="text-gray-700 font-medium">{req.otherUser.name}</Text>
                      <Text className="text-gray-500 text-sm">{req.event.name}</Text>
                    </View>
                    <View className="bg-orange-100 px-2 py-1 rounded-full">
                      <Text className="text-orange-700 text-xs">Aguardando</Text>
                    </View>
                  </View>
                ))}
              </View>
            ) : null
          }
        />
      )}

      {activeTab === 'available' && (
        <FlatList
          data={availableEvents}
          keyExtractor={(item) => item.event.id}
          contentContainerStyle={{ padding: 16, flexGrow: 1 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#7C3AED']} />
          }
          renderItem={renderAvailableEvent}
          ListEmptyComponent={renderEmptyState}
        />
      )}

      {activeTab === 'connections' && (
        <FlatList
          data={connections}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16, flexGrow: 1 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#7C3AED']} />
          }
          renderItem={renderConnectionItem}
          ListEmptyComponent={renderEmptyState}
        />
      )}

      {/* Send Request Modal */}
      <Modal
        visible={sendModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setSendModalVisible(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl p-6">
            <Text className="text-xl font-bold text-gray-900 mb-4">
              Enviar ReMatch
            </Text>

            {selectedUser && (
              <View className="flex-row items-center mb-4 bg-gray-50 p-3 rounded-xl">
                {selectedUser.profilePicture ? (
                  <Image
                    source={{ uri: selectedUser.profilePicture }}
                    className="w-12 h-12 rounded-full"
                  />
                ) : (
                  <View className="w-12 h-12 rounded-full bg-violet-100 items-center justify-center">
                    <Text className="text-xl">👤</Text>
                  </View>
                )}
                <View className="ml-3">
                  <Text className="text-gray-900 font-semibold">{selectedUser.name}</Text>
                  <Text className="text-gray-500">@{selectedUser.instagramUsername}</Text>
                </View>
              </View>
            )}

            <Text className="text-gray-700 mb-2">Mensagem (opcional)</Text>
            <TextInput
              className="bg-gray-100 rounded-xl p-4 text-gray-900 mb-4"
              placeholder="Oi! Te vi no evento e..."
              value={sendMessage}
              onChangeText={setSendMessage}
              multiline
              maxLength={200}
            />
            <Text className="text-gray-400 text-right text-sm mb-4">
              {sendMessage.length}/200
            </Text>

            <View className="flex-row gap-3">
              <Pressable
                className="flex-1 bg-gray-100 py-4 rounded-xl"
                onPress={() => {
                  setSendModalVisible(false);
                  setSelectedUser(null);
                  setSelectedEventId(null);
                  setSendMessage('');
                }}
              >
                <Text className="text-gray-700 font-medium text-center">Cancelar</Text>
              </Pressable>
              <Pressable
                className="flex-1 bg-violet-600 py-4 rounded-xl"
                onPress={handleSendRequest}
                disabled={processing === 'send'}
              >
                {processing === 'send' ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  <Text className="text-white font-medium text-center">Enviar</Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
