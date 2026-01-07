import { useEffect, useRef, useState, useCallback } from 'react';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { router } from 'expo-router';

import { api } from '../services/api';
import { useAuthStore } from '../stores/authStore';

// Configure notification handling
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export interface NotificationData {
  type?: 'match' | 'message' | 'event_reminder' | 'event_update';
  matchId?: string;
  eventId?: string;
  matchType?: string;
  eventName?: string;
}

export function useNotifications() {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [notification, setNotification] = useState<Notifications.Notification | null>(null);
  const { isAuthenticated } = useAuthStore();

  const notificationListener = useRef<Notifications.EventSubscription>();
  const responseListener = useRef<Notifications.EventSubscription>();

  // Navigate based on notification data
  const handleNotificationNavigation = useCallback((data: NotificationData) => {
    if (!isAuthenticated) {
      console.log('Not authenticated, skipping notification navigation');
      return;
    }

    switch (data.type) {
      case 'match':
        if (data.matchId) {
          router.push(`/chat/${data.matchId}`);
        } else {
          router.push('/(tabs)/matches');
        }
        break;
      case 'message':
        if (data.matchId) {
          router.push(`/chat/${data.matchId}`);
        } else {
          router.push('/(tabs)/matches');
        }
        break;
      case 'event_reminder':
      case 'event_update':
        if (data.eventId) {
          router.push(`/event/${data.eventId}`);
        } else {
          router.push('/(tabs)/home');
        }
        break;
      default:
        console.log('Unknown notification type:', data.type);
        router.push('/(tabs)/home');
    }
  }, [isAuthenticated]);

  useEffect(() => {
    registerForPushNotifications().then((token) => {
      setExpoPushToken(token || null);
    });

    // Listen for incoming notifications while app is foregrounded
    notificationListener.current = Notifications.addNotificationReceivedListener((notif) => {
      setNotification(notif);
    });

    // Listen for user interaction with notification
    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      const data = response.notification.request.content.data as NotificationData;
      handleNotificationNavigation(data);
    });

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current);
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, [handleNotificationNavigation]);

  // Register device token with backend when authenticated
  useEffect(() => {
    if (isAuthenticated && expoPushToken) {
      registerDeviceWithBackend(expoPushToken);
    }
  }, [isAuthenticated, expoPushToken]);

  return {
    expoPushToken,
    notification,
    navigateToNotification: handleNotificationNavigation,
  };
}

async function registerForPushNotifications(): Promise<string | undefined> {
  let token: string | undefined;

  // Check if running on physical device
  if (!Device.isDevice) {
    console.log('Push notifications require a physical device');
    return;
  }

  // Check/request permissions
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.log('Failed to get push notification permissions');
    return;
  }

  // Get Expo push token
  try {
    const response = await Notifications.getExpoPushTokenAsync({
      projectId: process.env.EXPO_PROJECT_ID,
    });
    token = response.data;
  } catch (error) {
    console.error('Failed to get Expo push token:', error);
    return;
  }

  // Configure Android notification channel
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('checkpoint-matches', {
      name: 'Matches',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#7C3AED',
    });

    await Notifications.setNotificationChannelAsync('checkpoint-messages', {
      name: 'Messages',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250],
    });

    await Notifications.setNotificationChannelAsync('checkpoint-events', {
      name: 'Events',
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }

  return token;
}

async function registerDeviceWithBackend(token: string) {
  try {
    await api.post('/notifications/device', {
      token,
      platform: Platform.OS as 'ios' | 'android',
    });
    console.log('Device registered for push notifications');
  } catch (error) {
    console.error('Failed to register device with backend:', error);
  }
}

// Helper to schedule local notifications (e.g., event reminders)
export async function scheduleEventReminder(
  eventId: string,
  eventName: string,
  eventDate: Date,
  minutesBefore: number = 60,
) {
  const triggerDate = new Date(eventDate);
  triggerDate.setMinutes(triggerDate.getMinutes() - minutesBefore);

  // Don't schedule if it's in the past
  if (triggerDate <= new Date()) {
    return null;
  }

  const identifier = await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Lembrete de Evento',
      body: `${eventName} começa em ${minutesBefore === 60 ? '1 hora' : `${minutesBefore} minutos`}!`,
      data: { type: 'event_reminder', eventId },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: triggerDate,
    },
  });

  return identifier;
}

export async function cancelEventReminder(identifier: string) {
  await Notifications.cancelScheduledNotificationAsync(identifier);
}
