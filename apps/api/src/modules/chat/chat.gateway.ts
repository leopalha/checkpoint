import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { ChatService } from './chat.service';
import { PrismaService } from '../../prisma/prisma.service';

type AuthenticatedSocket = Socket & { userId: string };

@WebSocketGateway({
  cors: {
    origin: process.env.NODE_ENV === 'production'
      ? [process.env.MOBILE_APP_URL || 'checkpoint://', process.env.DASHBOARD_URL || 'https://dashboard.checkpoint.app']
      : ['http://localhost:8081', 'http://localhost:3001', 'http://localhost:19006'],
    credentials: true,
  },
  namespace: '/chat',
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(ChatGateway.name);
  private userSockets = new Map<string, Set<string>>(); // userId -> Set<socketId>

  constructor(
    private chatService: ChatService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {}

  /**
   * Handle new connection - authenticate via JWT
   */
  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth?.token ||
                    client.handshake.headers?.authorization?.replace('Bearer ', '');

      if (!token) {
        this.logger.warn(`Client ${client.id} connected without token`);
        client.disconnect();
        return;
      }

      const payload = this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });

      const userId = payload.sub;
      (client as AuthenticatedSocket).userId = userId;

      // Track user's sockets
      if (!this.userSockets.has(userId)) {
        this.userSockets.set(userId, new Set());
      }
      this.userSockets.get(userId)!.add(client.id);

      // Join user's personal room
      client.join(`user:${userId}`);

      // Join all active conversation rooms
      const matches = await this.prisma.match.findMany({
        where: {
          OR: [{ user1Id: userId }, { user2Id: userId }],
          status: 'revealed',
          expiresAt: { gt: new Date() },
        },
        select: { id: true },
      });

      matches.forEach((match) => {
        client.join(`match:${match.id}`);
      });

      this.logger.log(`Client ${client.id} connected as user ${userId}`);
    } catch (error) {
      this.logger.warn(`Client ${client.id} auth failed: ${error}`);
      client.disconnect();
    }
  }

  /**
   * Handle disconnection
   */
  handleDisconnect(client: Socket) {
    const userId = (client as AuthenticatedSocket).userId;
    if (userId) {
      const sockets = this.userSockets.get(userId);
      if (sockets) {
        sockets.delete(client.id);
        if (sockets.size === 0) {
          this.userSockets.delete(userId);
        }
      }
    }
    this.logger.log(`Client ${client.id} disconnected`);
  }

  /**
   * Send a message
   */
  @SubscribeMessage('send_message')
  async handleSendMessage(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { matchId: string; content: string },
  ) {
    try {
      const message = await this.chatService.sendMessage(client.userId, {
        matchId: data.matchId,
        content: data.content,
      });

      // Broadcast to all users in the match room
      this.server.to(`match:${data.matchId}`).emit('new_message', message);

      // Also emit to specific user rooms for notification badges
      const match = await this.prisma.match.findUnique({
        where: { id: data.matchId },
        select: { user1Id: true, user2Id: true },
      });

      if (match) {
        const recipientId = match.user1Id === client.userId
          ? match.user2Id
          : match.user1Id;

        this.server.to(`user:${recipientId}`).emit('unread_update', {
          matchId: data.matchId,
        });
      }

      return { success: true, message };
    } catch (error) {
      this.logger.error(`Send message error: ${error}`);
      return { success: false, error: (error as Error).message };
    }
  }

  /**
   * Mark messages as read
   */
  @SubscribeMessage('mark_read')
  async handleMarkRead(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { matchId: string; lastMessageId: string },
  ) {
    try {
      await this.chatService.markMessagesAsRead(
        client.userId,
        data.matchId,
        data.lastMessageId,
      );

      // Notify sender that messages were read
      const match = await this.prisma.match.findUnique({
        where: { id: data.matchId },
        select: { user1Id: true, user2Id: true },
      });

      if (match) {
        const senderId = match.user1Id === client.userId
          ? match.user2Id
          : match.user1Id;

        this.server.to(`user:${senderId}`).emit('messages_read', {
          matchId: data.matchId,
          readBy: client.userId,
          lastMessageId: data.lastMessageId,
        });
      }

      return { success: true };
    } catch (error) {
      this.logger.error(`Mark read error: ${error}`);
      return { success: false, error: (error as Error).message };
    }
  }

  /**
   * User is typing indicator
   */
  @SubscribeMessage('typing')
  async handleTyping(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { matchId: string; isTyping: boolean },
  ) {
    // Broadcast typing status to other user in match
    client.to(`match:${data.matchId}`).emit('typing', {
      matchId: data.matchId,
      userId: client.userId,
      isTyping: data.isTyping,
    });
  }

  /**
   * Join a specific match room (when opening a conversation)
   */
  @SubscribeMessage('join_match')
  async handleJoinMatch(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { matchId: string },
  ) {
    try {
      // Verify user is part of this match
      const match = await this.prisma.match.findUnique({
        where: { id: data.matchId },
      });

      if (!match) {
        return { success: false, error: 'Match not found' };
      }

      if (match.user1Id !== client.userId && match.user2Id !== client.userId) {
        return { success: false, error: 'Not authorized' };
      }

      client.join(`match:${data.matchId}`);
      return { success: true };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }

  /**
   * Check if user is online
   */
  isUserOnline(userId: string): boolean {
    return this.userSockets.has(userId) && this.userSockets.get(userId)!.size > 0;
  }

  /**
   * Emit event to a specific user
   */
  emitToUser(userId: string, event: string, data: unknown) {
    this.server.to(`user:${userId}`).emit(event, data);
  }

  /**
   * Emit event to a match room
   */
  emitToMatch(matchId: string, event: string, data: unknown) {
    this.server.to(`match:${matchId}`).emit(event, data);
  }

  /**
   * Notify users about a new match reveal
   */
  notifyMatchRevealed(
    user1Id: string,
    user2Id: string,
    matchData: {
      matchId: string;
      interactionType: string;
      eventName: string;
      otherUserName: string;
      otherUserProfilePicture: string | null;
    },
  ) {
    // Notify user1 about user2
    this.emitToUser(user1Id, 'match_revealed', {
      matchId: matchData.matchId,
      interactionType: matchData.interactionType,
      eventName: matchData.eventName,
      otherUser: {
        name: matchData.otherUserName,
        profilePicture: matchData.otherUserProfilePicture,
      },
    });

    // Notify user2 about user1 (we need to swap the data)
    this.emitToUser(user2Id, 'match_revealed', {
      matchId: matchData.matchId,
      interactionType: matchData.interactionType,
      eventName: matchData.eventName,
      otherUser: {
        name: matchData.otherUserName,
        profilePicture: matchData.otherUserProfilePicture,
      },
    });
  }
}
