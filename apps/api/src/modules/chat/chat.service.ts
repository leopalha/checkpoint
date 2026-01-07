import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  Inject,
  forwardRef,
} from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import {
  SendMessageDto,
  MessageResponseDto,
  ConversationResponseDto,
} from './dto/chat.dto';

@Injectable()
export class ChatService {
  constructor(
    private prisma: PrismaService,
    @Inject(forwardRef(() => NotificationsService))
    private notificationsService: NotificationsService,
  ) {}

  /**
   * Get all conversations for a user
   */
  async getConversations(userId: string): Promise<ConversationResponseDto[]> {
    const matches = await this.prisma.match.findMany({
      where: {
        OR: [{ user1Id: userId }, { user2Id: userId }],
        status: 'revealed',
        expiresAt: {
          gt: new Date(),
        },
      },
      include: {
        user1: {
          select: {
            id: true,
            name: true,
            instagramUsername: true,
            profilePicture: true,
          },
        },
        user2: {
          select: {
            id: true,
            name: true,
            instagramUsername: true,
            profilePicture: true,
          },
        },
        event: {
          select: {
            id: true,
            name: true,
          },
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          select: {
            id: true,
            content: true,
            senderId: true,
            createdAt: true,
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    // Get unread counts for each match
    const conversationsWithUnread = await Promise.all(
      matches.map(async (match) => {
        const otherUser = match.user1Id === userId ? match.user2 : match.user1;
        const lastMessage = match.messages[0] || null;

        const unreadCount = await this.prisma.message.count({
          where: {
            matchId: match.id,
            senderId: { not: userId },
            readAt: null,
          },
        });

        return {
          matchId: match.id,
          otherUser: {
            id: otherUser.id,
            name: otherUser.name,
            instagramUsername: otherUser.instagramUsername,
            profilePicture: otherUser.profilePicture,
          },
          event: {
            id: match.event.id,
            name: match.event.name,
          },
          interactionType: match.interactionType,
          lastMessage: lastMessage
            ? {
                content: lastMessage.content,
                createdAt: lastMessage.createdAt.toISOString(),
                isOwn: lastMessage.senderId === userId,
              }
            : null,
          unreadCount,
          expiresAt: match.expiresAt?.toISOString() || null,
        };
      }),
    );

    return conversationsWithUnread;
  }

  /**
   * Get messages for a specific match/conversation
   */
  async getMessages(
    userId: string,
    matchId: string,
    cursor?: string,
    limit = 50,
  ): Promise<MessageResponseDto[]> {
    // Validate user is part of this match
    const match = await this.prisma.match.findUnique({
      where: { id: matchId },
    });

    if (!match) {
      throw new NotFoundException('Conversa não encontrada');
    }

    if (match.user1Id !== userId && match.user2Id !== userId) {
      throw new ForbiddenException('Você não faz parte desta conversa');
    }

    if (match.status !== 'revealed') {
      throw new BadRequestException('Match ainda não foi revelado');
    }

    if (match.expiresAt && match.expiresAt < new Date()) {
      throw new BadRequestException('Esta conversa expirou');
    }

    const messages = await this.prisma.message.findMany({
      where: {
        matchId,
        ...(cursor && {
          createdAt: {
            lt: (await this.prisma.message.findUnique({ where: { id: cursor } }))
              ?.createdAt,
          },
        }),
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      select: {
        id: true,
        matchId: true,
        senderId: true,
        content: true,
        readAt: true,
        createdAt: true,
      },
    });

    return messages.map((msg) => ({
      id: msg.id,
      matchId: msg.matchId,
      senderId: msg.senderId,
      content: msg.content,
      isOwn: msg.senderId === userId,
      readAt: msg.readAt?.toISOString() || null,
      createdAt: msg.createdAt.toISOString(),
    }));
  }

  /**
   * Send a message to a match
   */
  async sendMessage(
    userId: string,
    dto: SendMessageDto,
  ): Promise<MessageResponseDto> {
    // Validate user is part of this match
    const match = await this.prisma.match.findUnique({
      where: { id: dto.matchId },
    });

    if (!match) {
      throw new NotFoundException('Conversa não encontrada');
    }

    if (match.user1Id !== userId && match.user2Id !== userId) {
      throw new ForbiddenException('Você não faz parte desta conversa');
    }

    if (match.status !== 'revealed') {
      throw new BadRequestException('Match ainda não foi revelado');
    }

    if (match.expiresAt && match.expiresAt < new Date()) {
      throw new BadRequestException('Esta conversa expirou');
    }

    // Get sender name for notification
    const sender = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { name: true },
    });

    // Create message
    const message = await this.prisma.message.create({
      data: {
        matchId: dto.matchId,
        senderId: userId,
        content: dto.content,
      },
    });

    // Update match's updatedAt to sort conversations
    await this.prisma.match.update({
      where: { id: dto.matchId },
      data: { updatedAt: new Date() },
    });

    // Send push notification to recipient
    const recipientId = match.user1Id === userId ? match.user2Id : match.user1Id;
    await this.notificationsService.notifyNewMessage(
      recipientId,
      sender?.name || 'Alguém',
      dto.content,
      dto.matchId,
    );

    return {
      id: message.id,
      matchId: message.matchId,
      senderId: message.senderId,
      content: message.content,
      isOwn: true,
      readAt: null,
      createdAt: message.createdAt.toISOString(),
    };
  }

  /**
   * Mark messages as read
   */
  async markMessagesAsRead(
    userId: string,
    matchId: string,
    lastMessageId: string,
  ): Promise<{ count: number }> {
    // Validate user is part of this match
    const match = await this.prisma.match.findUnique({
      where: { id: matchId },
    });

    if (!match) {
      throw new NotFoundException('Conversa não encontrada');
    }

    if (match.user1Id !== userId && match.user2Id !== userId) {
      throw new ForbiddenException('Você não faz parte desta conversa');
    }

    // Get the timestamp of the last message
    const lastMessage = await this.prisma.message.findUnique({
      where: { id: lastMessageId },
    });

    if (!lastMessage) {
      throw new NotFoundException('Mensagem não encontrada');
    }

    // Mark all messages from the other user up to this point as read
    const result = await this.prisma.message.updateMany({
      where: {
        matchId,
        senderId: { not: userId },
        readAt: null,
        createdAt: { lte: lastMessage.createdAt },
      },
      data: {
        readAt: new Date(),
      },
    });

    return { count: result.count };
  }

  /**
   * Get conversation details (for chat header)
   */
  async getConversationDetails(
    userId: string,
    matchId: string,
  ): Promise<{
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
  }> {
    const match = await this.prisma.match.findUnique({
      where: { id: matchId },
      include: {
        user1: {
          select: {
            id: true,
            name: true,
            instagramUsername: true,
            profilePicture: true,
          },
        },
        user2: {
          select: {
            id: true,
            name: true,
            instagramUsername: true,
            profilePicture: true,
          },
        },
        event: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!match) {
      throw new NotFoundException('Conversa não encontrada');
    }

    if (match.user1Id !== userId && match.user2Id !== userId) {
      throw new ForbiddenException('Você não faz parte desta conversa');
    }

    const otherUser = match.user1Id === userId ? match.user2 : match.user1;

    return {
      match: {
        id: match.id,
        interactionType: match.interactionType,
        expiresAt: match.expiresAt?.toISOString() || null,
      },
      otherUser,
      event: match.event,
    };
  }

  /**
   * Get total unread count for a user
   */
  async getUnreadCount(userId: string): Promise<number> {
    // Get all revealed matches for user
    const matches = await this.prisma.match.findMany({
      where: {
        OR: [{ user1Id: userId }, { user2Id: userId }],
        status: 'revealed',
        expiresAt: { gt: new Date() },
      },
      select: { id: true },
    });

    const matchIds = matches.map((m) => m.id);

    if (matchIds.length === 0) return 0;

    const count = await this.prisma.message.count({
      where: {
        matchId: { in: matchIds },
        senderId: { not: userId },
        readAt: null,
      },
    });

    return count;
  }
}
