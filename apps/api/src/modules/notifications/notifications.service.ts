import { Injectable, Logger } from '@nestjs/common';
import * as admin from 'firebase-admin';

import { PrismaService } from '../../prisma/prisma.service';

interface SendNotificationOptions {
  userId: string;
  title: string;
  body: string;
  data?: Record<string, string>;
}

interface SendMulticastOptions {
  userIds: string[];
  title: string;
  body: string;
  data?: Record<string, string>;
}

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);
  private firebaseApp: admin.app.App | null = null;

  constructor(private prisma: PrismaService) {
    this.initializeFirebase();
  }

  private initializeFirebase() {
    try {
      const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT;

      if (!serviceAccount) {
        this.logger.warn('FIREBASE_SERVICE_ACCOUNT not configured. Push notifications disabled.');
        return;
      }

      const credentials = JSON.parse(serviceAccount);

      this.firebaseApp = admin.initializeApp({
        credential: admin.credential.cert(credentials),
      });

      this.logger.log('Firebase Admin initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize Firebase Admin:', error);
    }
  }

  async registerDeviceToken(userId: string, token: string, platform: 'ios' | 'android') {
    // Upsert device token - update if exists, create if not
    await this.prisma.deviceToken.upsert({
      where: { token },
      update: { userId, platform, updatedAt: new Date() },
      create: { userId, token, platform },
    });

    this.logger.log(`Device token registered for user ${userId} on ${platform}`);
    return { success: true };
  }

  async unregisterDeviceToken(userId: string, token: string) {
    try {
      await this.prisma.deviceToken.delete({
        where: { token },
      });
    } catch {
      // Token might not exist, that's fine
    }

    this.logger.log(`Device token unregistered for user ${userId}`);
    return { success: true };
  }

  async sendNotification(options: SendNotificationOptions): Promise<boolean> {
    if (!this.firebaseApp) {
      this.logger.warn('Firebase not initialized, skipping notification');
      return false;
    }

    try {
      // Get user's device token from database
      // For MVP, we'll simulate this
      const deviceToken = await this.getUserDeviceToken(options.userId);

      if (!deviceToken) {
        this.logger.warn(`No device token found for user ${options.userId}`);
        return false;
      }

      const message: admin.messaging.Message = {
        token: deviceToken,
        notification: {
          title: options.title,
          body: options.body,
        },
        data: options.data || {},
        android: {
          priority: 'high',
          notification: {
            sound: 'default',
            channelId: 'checkpoint-matches',
          },
        },
        apns: {
          payload: {
            aps: {
              sound: 'default',
              badge: 1,
            },
          },
        },
      };

      await admin.messaging().send(message);
      this.logger.log(`Notification sent to user ${options.userId}`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to send notification to user ${options.userId}:`, error);
      return false;
    }
  }

  async sendMulticast(options: SendMulticastOptions): Promise<{ success: number; failure: number }> {
    if (!this.firebaseApp) {
      this.logger.warn('Firebase not initialized, skipping multicast');
      return { success: 0, failure: options.userIds.length };
    }

    try {
      const tokens = await Promise.all(
        options.userIds.map((userId) => this.getUserDeviceToken(userId))
      );

      const validTokens = tokens.filter((token): token is string => !!token);

      if (validTokens.length === 0) {
        return { success: 0, failure: options.userIds.length };
      }

      const message: admin.messaging.MulticastMessage = {
        tokens: validTokens,
        notification: {
          title: options.title,
          body: options.body,
        },
        data: options.data || {},
      };

      const response = await admin.messaging().sendEachForMulticast(message);

      this.logger.log(
        `Multicast sent: ${response.successCount} success, ${response.failureCount} failures`
      );

      return {
        success: response.successCount,
        failure: response.failureCount,
      };
    } catch (error) {
      this.logger.error('Failed to send multicast notification:', error);
      return { success: 0, failure: options.userIds.length };
    }
  }

  // Notification helpers for specific events
  async notifyNewMatch(
    user1Id: string,
    user2Id: string,
    matchType: string,
    eventName: string,
  ) {
    const [user1, user2] = await Promise.all([
      this.prisma.user.findUnique({ where: { id: user1Id } }),
      this.prisma.user.findUnique({ where: { id: user2Id } }),
    ]);

    if (!user1 || !user2) return;

    const matchEmoji = matchType === 'fire' ? '🔥' : matchType === 'handshake' ? '🤝' : '✋';

    // Notify both users
    await Promise.all([
      this.sendNotification({
        userId: user1Id,
        title: `${matchEmoji} Novo Match!`,
        body: `Você e ${user2.name} se curtiram no ${eventName}!`,
        data: { type: 'match', matchType, eventName },
      }),
      this.sendNotification({
        userId: user2Id,
        title: `${matchEmoji} Novo Match!`,
        body: `Você e ${user1.name} se curtiram no ${eventName}!`,
        data: { type: 'match', matchType, eventName },
      }),
    ]);
  }

  async notifyNewMessage(
    recipientId: string,
    senderName: string,
    messagePreview: string,
    matchId: string,
  ) {
    await this.sendNotification({
      userId: recipientId,
      title: `💬 ${senderName}`,
      body: messagePreview.length > 50 ? messagePreview.substring(0, 47) + '...' : messagePreview,
      data: { type: 'message', matchId },
    });
  }

  async notifyEventReminder(
    userId: string,
    eventName: string,
    eventId: string,
    minutesUntil: number,
  ) {
    const timeText = minutesUntil === 60 ? '1 hora' : `${minutesUntil} minutos`;

    await this.sendNotification({
      userId,
      title: '📅 Lembrete de Evento',
      body: `${eventName} começa em ${timeText}!`,
      data: { type: 'event_reminder', eventId },
    });
  }

  async notifyEventAttendees(
    eventId: string,
    title: string,
    body: string,
  ) {
    const presences = await this.prisma.presence.findMany({
      where: { eventId },
      select: { userId: true },
    });

    const userIds = presences.map((p) => p.userId);

    return this.sendMulticast({
      userIds,
      title,
      body,
      data: { type: 'event_update', eventId },
    });
  }

  async notifyRematchRequest(
    recipientId: string,
    senderId: string,
    eventName: string,
  ) {
    const sender = await this.prisma.user.findUnique({
      where: { id: senderId },
      select: { name: true },
    });

    if (!sender) return;

    await this.sendNotification({
      userId: recipientId,
      title: '💜 Nova solicitacao de ReMatch!',
      body: `Alguém do ${eventName} quer conectar com você`,
      data: {
        type: 'rematch_request',
        eventName,
        deep_link: 'checkpoint://rematch/requests',
      },
    });
  }

  async notifyRematchAccepted(
    recipientId: string,
    accepterId: string,
    eventName: string,
  ) {
    const accepter = await this.prisma.user.findUnique({
      where: { id: accepterId },
      select: { name: true },
    });

    if (!accepter) return;

    await this.sendNotification({
      userId: recipientId,
      title: '🎉 ReMatch aceito!',
      body: `${accepter.name} aceitou sua solicitação do ${eventName}!`,
      data: {
        type: 'rematch_accepted',
        eventName,
        deep_link: 'checkpoint://rematch/celebration',
      },
    });
  }

  private async getUserDeviceToken(userId: string): Promise<string | null> {
    const deviceToken = await this.prisma.deviceToken.findFirst({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
    });

    return deviceToken?.token || null;
  }
}
