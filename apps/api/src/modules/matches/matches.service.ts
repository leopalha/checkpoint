import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
  forwardRef,
} from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { ChatGateway } from '../chat/chat.gateway';
import { MatchResponseDto, RevealMatchResponseDto } from './dto/match.dto';

const CHAT_EXPIRY_DAYS = 7;

@Injectable()
export class MatchesService {
  constructor(
    private prisma: PrismaService,
    @Inject(forwardRef(() => NotificationsService))
    private notificationsService: NotificationsService,
    @Inject(forwardRef(() => ChatGateway))
    private chatGateway: ChatGateway,
  ) {}

  async getMyMatches(
    userId: string,
    status?: 'pending' | 'revealed' | 'expired',
  ): Promise<MatchResponseDto[]> {
    const where = {
      OR: [{ user1Id: userId }, { user2Id: userId }],
      ...(status && { status }),
    };

    const matches = await this.prisma.match.findMany({
      where,
      include: {
        user1: {
          select: {
            id: true,
            name: true,
            instagramUsername: true,
            profilePicture: true,
            bio: true,
          },
        },
        user2: {
          select: {
            id: true,
            name: true,
            instagramUsername: true,
            profilePicture: true,
            bio: true,
          },
        },
        event: {
          select: {
            id: true,
            name: true,
            locationName: true,
          },
        },
        messages: {
          where: {
            senderId: { not: userId },
            readAt: null,
          },
          select: { id: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return matches.map((match) => {
      const otherUser = match.user1Id === userId ? match.user2 : match.user1;
      const canChat = match.status === 'revealed' &&
        (!match.expiresAt || match.expiresAt > new Date());

      return {
        id: match.id,
        eventId: match.eventId,
        interactionType: match.interactionType,
        status: match.status,
        revealedAt: match.revealedAt,
        expiresAt: match.expiresAt,
        createdAt: match.createdAt,
        otherUser,
        event: match.event,
        canChat,
        unreadCount: match.messages.length,
      };
    });
  }

  async getMatchById(userId: string, matchId: string): Promise<MatchResponseDto> {
    const match = await this.prisma.match.findUnique({
      where: { id: matchId },
      include: {
        user1: {
          select: {
            id: true,
            name: true,
            instagramUsername: true,
            profilePicture: true,
            bio: true,
          },
        },
        user2: {
          select: {
            id: true,
            name: true,
            instagramUsername: true,
            profilePicture: true,
            bio: true,
          },
        },
        event: {
          select: {
            id: true,
            name: true,
            locationName: true,
          },
        },
        messages: {
          where: {
            senderId: { not: userId },
            readAt: null,
          },
          select: { id: true },
        },
      },
    });

    if (!match) {
      throw new NotFoundException('Match not found');
    }

    if (match.user1Id !== userId && match.user2Id !== userId) {
      throw new NotFoundException('Match not found');
    }

    const otherUser = match.user1Id === userId ? match.user2 : match.user1;
    const canChat = match.status === 'revealed' &&
      (!match.expiresAt || match.expiresAt > new Date());

    return {
      id: match.id,
      eventId: match.eventId,
      interactionType: match.interactionType,
      status: match.status,
      revealedAt: match.revealedAt,
      expiresAt: match.expiresAt,
      createdAt: match.createdAt,
      otherUser,
      event: match.event,
      canChat,
      unreadCount: match.messages.length,
    };
  }

  async revealMatch(userId: string, matchId: string): Promise<RevealMatchResponseDto> {
    const match = await this.prisma.match.findUnique({
      where: { id: matchId },
      include: {
        event: true,
      },
    });

    if (!match) {
      throw new NotFoundException('Match not found');
    }

    if (match.user1Id !== userId && match.user2Id !== userId) {
      throw new NotFoundException('Match not found');
    }

    // Check if user is checked in at the event
    const presence = await this.prisma.presence.findUnique({
      where: {
        userId_eventId: { userId, eventId: match.eventId },
      },
    });

    if (!presence?.checkedInAt) {
      throw new BadRequestException(
        'You must be checked in at the event to reveal a match',
      );
    }

    // Check if both users are checked in (for reveal)
    const otherUserId = match.user1Id === userId ? match.user2Id : match.user1Id;
    const otherPresence = await this.prisma.presence.findUnique({
      where: {
        userId_eventId: { userId: otherUserId, eventId: match.eventId },
      },
    });

    if (!otherPresence?.checkedInAt) {
      throw new BadRequestException(
        'Both users must be checked in at the event to reveal a match',
      );
    }

    let isNewReveal = false;

    if (match.status === 'pending') {
      // Reveal the match
      const now = new Date();
      const expiresAt = new Date(now.getTime() + CHAT_EXPIRY_DAYS * 24 * 60 * 60 * 1000);

      await this.prisma.match.update({
        where: { id: matchId },
        data: {
          status: 'revealed',
          revealedAt: now,
          expiresAt,
        },
      });

      isNewReveal = true;

      // Get user data for real-time notifications
      const [user1, user2] = await Promise.all([
        this.prisma.user.findUnique({
          where: { id: match.user1Id },
          select: { name: true, profilePicture: true },
        }),
        this.prisma.user.findUnique({
          where: { id: match.user2Id },
          select: { name: true, profilePicture: true },
        }),
      ]);

      // Send real-time WebSocket notifications
      if (user1 && user2) {
        // Notify user1 about user2
        this.chatGateway.emitToUser(match.user1Id, 'match_revealed', {
          matchId,
          interactionType: match.interactionType,
          eventName: match.event.name,
          otherUser: {
            id: match.user2Id,
            name: user2.name,
            profilePicture: user2.profilePicture,
          },
        });

        // Notify user2 about user1
        this.chatGateway.emitToUser(match.user2Id, 'match_revealed', {
          matchId,
          interactionType: match.interactionType,
          eventName: match.event.name,
          otherUser: {
            id: match.user1Id,
            name: user1.name,
            profilePicture: user1.profilePicture,
          },
        });
      }

      // Send push notifications to both users
      await this.notificationsService.notifyNewMatch(
        match.user1Id,
        match.user2Id,
        match.interactionType,
        match.event.name,
      );
    }

    const updatedMatch = await this.getMatchById(userId, matchId);

    return {
      match: updatedMatch,
      isNewReveal,
    };
  }

  async getPendingMatchesForEvent(
    userId: string,
    eventId: string,
  ): Promise<{ count: number; canReveal: boolean }> {
    const pendingMatches = await this.prisma.match.count({
      where: {
        OR: [{ user1Id: userId }, { user2Id: userId }],
        eventId,
        status: 'pending',
      },
    });

    // Check if user is checked in
    const presence = await this.prisma.presence.findUnique({
      where: {
        userId_eventId: { userId, eventId },
      },
    });

    return {
      count: pendingMatches,
      canReveal: !!presence?.checkedInAt,
    };
  }

  async expireOldMatches(): Promise<number> {
    const result = await this.prisma.match.updateMany({
      where: {
        status: 'revealed',
        expiresAt: { lt: new Date() },
      },
      data: { status: 'expired' },
    });

    return result.count;
  }

  async getMatchStats(userId: string): Promise<{
    total: number;
    pending: number;
    revealed: number;
    expired: number;
  }> {
    const where = {
      OR: [{ user1Id: userId }, { user2Id: userId }],
    };

    const [total, pending, revealed, expired] = await Promise.all([
      this.prisma.match.count({ where }),
      this.prisma.match.count({ where: { ...where, status: 'pending' } }),
      this.prisma.match.count({ where: { ...where, status: 'revealed' } }),
      this.prisma.match.count({ where: { ...where, status: 'expired' } }),
    ]);

    return { total, pending, revealed, expired };
  }
}
