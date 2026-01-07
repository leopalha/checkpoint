import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  Inject,
  forwardRef,
} from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { ChatGateway } from '../chat/chat.gateway';
import {
  CreateRematchRequestDto,
  RematchRequestResponseDto,
  RematchRequestsResponseDto,
  AvailableForRematchResponseDto,
  RematchConnectionsResponseDto,
  RematchStatsDto,
} from './dto/rematch.dto';

const REMATCH_WINDOW_DAYS = 7;
const DAILY_REMATCH_LIMIT = 10;
const CHAT_EXPIRY_DAYS = 7;

@Injectable()
export class RematchService {
  constructor(
    private prisma: PrismaService,
    @Inject(forwardRef(() => NotificationsService))
    private notificationsService: NotificationsService,
    @Inject(forwardRef(() => ChatGateway))
    private chatGateway: ChatGateway,
  ) {}

  async getRequests(userId: string): Promise<RematchRequestsResponseDto> {
    // Get pending requests received by this user
    const pendingReceived = await this.prisma.rematchRequest.findMany({
      where: {
        toUserId: userId,
        status: 'pending',
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Get requests sent by this user (pending)
    const sent = await this.prisma.rematchRequest.findMany({
      where: {
        fromUserId: userId,
        status: 'pending',
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Enrich with user and event data
    const pending = await this.enrichRequests(pendingReceived, userId, 'from');
    const sentEnriched = await this.enrichRequests(sent, userId, 'to');

    return {
      pending,
      sent: sentEnriched,
    };
  }

  async getAvailable(userId: string): Promise<AvailableForRematchResponseDto> {
    const now = new Date();
    const windowStart = new Date(now.getTime() - REMATCH_WINDOW_DAYS * 24 * 60 * 60 * 1000);

    // Get events where the user had a check-in in the last 7 days
    const userPresences = await this.prisma.presence.findMany({
      where: {
        userId,
        checkedInAt: { not: null },
        event: {
          endDate: {
            gte: windowStart,
            lt: now,
          },
        },
      },
      include: {
        event: true,
      },
      orderBy: {
        event: { endDate: 'desc' },
      },
    });

    const eventIds = userPresences.map(p => p.eventId);

    // Get blocked user IDs
    const blocks = await this.prisma.userBlock.findMany({
      where: {
        OR: [{ blockerId: userId }, { blockedId: userId }],
      },
    });
    const blockedUserIds = new Set(
      blocks.map(b => (b.blockerId === userId ? b.blockedId : b.blockerId))
    );

    // Get existing matches to exclude
    const existingMatches = await this.prisma.match.findMany({
      where: {
        OR: [{ user1Id: userId }, { user2Id: userId }],
        eventId: { in: eventIds },
      },
    });
    const matchedUserIds = new Set(
      existingMatches.map(m => (m.user1Id === userId ? m.user2Id : m.user1Id))
    );

    // Get requests already sent
    const sentRequests = await this.prisma.rematchRequest.findMany({
      where: {
        fromUserId: userId,
        eventId: { in: eventIds },
      },
    });
    const sentToUserEventPairs = new Set(
      sentRequests.map(r => `${r.toUserId}:${r.eventId}`)
    );

    // Build available users per event
    const events: AvailableForRematchResponseDto['events'] = [];

    for (const presence of userPresences) {
      // Get other users who checked in at the same event
      const otherPresences = await this.prisma.presence.findMany({
        where: {
          eventId: presence.eventId,
          userId: { not: userId },
          checkedInAt: { not: null },
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              instagramUsername: true,
              profilePicture: true,
              bio: true,
            },
          },
        },
      });

      const availableUsers = otherPresences
        .filter(p => !blockedUserIds.has(p.userId) && !matchedUserIds.has(p.userId))
        .map(p => ({
          ...p.user,
          requestSent: sentToUserEventPairs.has(`${p.userId}:${presence.eventId}`),
        }));

      if (availableUsers.length > 0) {
        events.push({
          event: {
            id: presence.event.id,
            name: presence.event.name,
            locationName: presence.event.locationName,
            startDate: presence.event.startDate,
            endDate: presence.event.endDate,
          },
          users: availableUsers,
        });
      }
    }

    // Get remaining requests for today
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayRequestCount = await this.prisma.rematchRequest.count({
      where: {
        fromUserId: userId,
        createdAt: { gte: todayStart },
      },
    });

    return {
      events,
      dailyLimit: DAILY_REMATCH_LIMIT,
      remainingToday: Math.max(0, DAILY_REMATCH_LIMIT - todayRequestCount),
    };
  }

  async sendRequest(
    userId: string,
    dto: CreateRematchRequestDto,
  ): Promise<RematchRequestResponseDto> {
    const { toUserId, eventId, message } = dto;

    // Validate not sending to self
    if (userId === toUserId) {
      throw new BadRequestException('Cannot send rematch request to yourself');
    }

    // Check daily limit
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayRequestCount = await this.prisma.rematchRequest.count({
      where: {
        fromUserId: userId,
        createdAt: { gte: todayStart },
      },
    });

    if (todayRequestCount >= DAILY_REMATCH_LIMIT) {
      throw new BadRequestException(
        `You have reached the daily limit of ${DAILY_REMATCH_LIMIT} rematch requests`
      );
    }

    // Check if blocked
    const block = await this.prisma.userBlock.findFirst({
      where: {
        OR: [
          { blockerId: userId, blockedId: toUserId },
          { blockerId: toUserId, blockedId: userId },
        ],
      },
    });

    if (block) {
      throw new ForbiddenException('Cannot send rematch request to this user');
    }

    // Check if both users attended the event
    const [fromPresence, toPresence] = await Promise.all([
      this.prisma.presence.findUnique({
        where: { userId_eventId: { userId, eventId } },
      }),
      this.prisma.presence.findUnique({
        where: { userId_eventId: { userId: toUserId, eventId } },
      }),
    ]);

    if (!fromPresence?.checkedInAt || !toPresence?.checkedInAt) {
      throw new BadRequestException('Both users must have checked in at the event');
    }

    // Check if event is within rematch window
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    const windowStart = new Date();
    windowStart.setDate(windowStart.getDate() - REMATCH_WINDOW_DAYS);

    if (event.endDate < windowStart) {
      throw new BadRequestException('Event is outside the 7-day rematch window');
    }

    // Check if already have a match
    const existingMatch = await this.prisma.match.findFirst({
      where: {
        eventId,
        OR: [
          { user1Id: userId, user2Id: toUserId },
          { user1Id: toUserId, user2Id: userId },
        ],
      },
    });

    if (existingMatch) {
      throw new BadRequestException('You already have a match with this user for this event');
    }

    // Check if request already exists
    const existingRequest = await this.prisma.rematchRequest.findUnique({
      where: {
        fromUserId_toUserId_eventId: { fromUserId: userId, toUserId, eventId },
      },
    });

    if (existingRequest) {
      throw new BadRequestException('You have already sent a rematch request to this user');
    }

    // Check if there's a pending request from the other user (auto-match!)
    const reverseRequest = await this.prisma.rematchRequest.findFirst({
      where: {
        fromUserId: toUserId,
        toUserId: userId,
        eventId,
        status: 'pending',
      },
    });

    if (reverseRequest) {
      // Auto-match! Accept the reverse request
      return this.acceptRequest(userId, reverseRequest.id);
    }

    // Create the request
    const expiresAt = new Date(event.endDate.getTime() + REMATCH_WINDOW_DAYS * 24 * 60 * 60 * 1000);

    const request = await this.prisma.rematchRequest.create({
      data: {
        fromUserId: userId,
        toUserId,
        eventId,
        message,
        expiresAt,
      },
    });

    // Send notification
    await this.notificationsService.notifyRematchRequest(toUserId, userId, event.name);

    // Emit WebSocket event
    this.chatGateway.emitToUser(toUserId, 'rematch_request', {
      requestId: request.id,
      eventName: event.name,
    });

    return this.enrichRequest(request, userId);
  }

  async acceptRequest(
    userId: string,
    requestId: string,
  ): Promise<RematchRequestResponseDto> {
    const request = await this.prisma.rematchRequest.findUnique({
      where: { id: requestId },
    });

    if (!request) {
      throw new NotFoundException('Rematch request not found');
    }

    if (request.toUserId !== userId) {
      throw new ForbiddenException('You can only accept requests sent to you');
    }

    if (request.status !== 'pending') {
      throw new BadRequestException('This request has already been processed');
    }

    if (request.expiresAt < new Date()) {
      throw new BadRequestException('This request has expired');
    }

    // Update request status
    const updatedRequest = await this.prisma.rematchRequest.update({
      where: { id: requestId },
      data: {
        status: 'accepted',
        respondedAt: new Date(),
      },
    });

    // Create a match
    const now = new Date();
    const expiresAt = new Date(now.getTime() + CHAT_EXPIRY_DAYS * 24 * 60 * 60 * 1000);

    // Ensure consistent ordering of user IDs
    const [user1Id, user2Id] = [request.fromUserId, request.toUserId].sort();

    const match = await this.prisma.match.create({
      data: {
        user1Id,
        user2Id,
        eventId: request.eventId,
        interactionType: 'rematch',
        status: 'revealed',
        revealedAt: now,
        expiresAt,
      },
    });

    // Get event and user data for notifications
    const [event, fromUser, toUser] = await Promise.all([
      this.prisma.event.findUnique({ where: { id: request.eventId } }),
      this.prisma.user.findUnique({
        where: { id: request.fromUserId },
        select: { name: true, profilePicture: true },
      }),
      this.prisma.user.findUnique({
        where: { id: userId },
        select: { name: true, profilePicture: true },
      }),
    ]);

    // Notify the original sender
    if (event) {
      await this.notificationsService.notifyRematchAccepted(
        request.fromUserId,
        userId,
        event.name,
      );

      // WebSocket notifications
      if (fromUser) {
        this.chatGateway.emitToUser(request.fromUserId, 'rematch_accepted', {
          requestId: request.id,
          matchId: match.id,
          eventName: event.name,
          user: toUser,
        });
      }

      if (toUser) {
        this.chatGateway.emitToUser(userId, 'match_created', {
          matchId: match.id,
          interactionType: 'rematch',
          eventName: event.name,
          user: fromUser,
        });
      }
    }

    return this.enrichRequest(updatedRequest, userId);
  }

  async ignoreRequest(
    userId: string,
    requestId: string,
  ): Promise<RematchRequestResponseDto> {
    const request = await this.prisma.rematchRequest.findUnique({
      where: { id: requestId },
    });

    if (!request) {
      throw new NotFoundException('Rematch request not found');
    }

    if (request.toUserId !== userId) {
      throw new ForbiddenException('You can only ignore requests sent to you');
    }

    if (request.status !== 'pending') {
      throw new BadRequestException('This request has already been processed');
    }

    const updatedRequest = await this.prisma.rematchRequest.update({
      where: { id: requestId },
      data: {
        status: 'ignored',
        respondedAt: new Date(),
      },
    });

    return this.enrichRequest(updatedRequest, userId);
  }

  async getConnections(
    userId: string,
    page: number = 1,
    perPage: number = 20,
  ): Promise<RematchConnectionsResponseDto> {
    const skip = (page - 1) * perPage;

    // Get matches that originated from rematch
    const matches = await this.prisma.match.findMany({
      where: {
        OR: [{ user1Id: userId }, { user2Id: userId }],
        interactionType: 'rematch',
        status: 'revealed',
      },
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
            startDate: true,
            endDate: true,
          },
        },
      },
      orderBy: { revealedAt: 'desc' },
      skip,
      take: perPage,
    });

    const total = await this.prisma.match.count({
      where: {
        OR: [{ user1Id: userId }, { user2Id: userId }],
        interactionType: 'rematch',
        status: 'revealed',
      },
    });

    const connections = matches.map(match => {
      const otherUser = match.user1Id === userId ? match.user2 : match.user1;
      return {
        id: match.id,
        user: otherUser,
        event: match.event,
        connectedAt: match.revealedAt!,
        matchId: match.id,
      };
    });

    return { connections, total };
  }

  async getStats(userId: string): Promise<RematchStatsDto> {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const [requestsSent, requestsReceived, connectionsFromRematch, todayRequestCount] =
      await Promise.all([
        this.prisma.rematchRequest.count({
          where: { fromUserId: userId },
        }),
        this.prisma.rematchRequest.count({
          where: { toUserId: userId },
        }),
        this.prisma.match.count({
          where: {
            OR: [{ user1Id: userId }, { user2Id: userId }],
            interactionType: 'rematch',
          },
        }),
        this.prisma.rematchRequest.count({
          where: {
            fromUserId: userId,
            createdAt: { gte: todayStart },
          },
        }),
      ]);

    return {
      requestsSent,
      requestsReceived,
      connectionsFromRematch,
      remainingToday: Math.max(0, DAILY_REMATCH_LIMIT - todayRequestCount),
      dailyLimit: DAILY_REMATCH_LIMIT,
    };
  }

  async blockUser(userId: string, blockedId: string): Promise<void> {
    if (userId === blockedId) {
      throw new BadRequestException('Cannot block yourself');
    }

    await this.prisma.userBlock.upsert({
      where: {
        blockerId_blockedId: { blockerId: userId, blockedId },
      },
      create: {
        blockerId: userId,
        blockedId,
      },
      update: {},
    });

    // Also ignore any pending requests
    await this.prisma.rematchRequest.updateMany({
      where: {
        OR: [
          { fromUserId: userId, toUserId: blockedId, status: 'pending' },
          { fromUserId: blockedId, toUserId: userId, status: 'pending' },
        ],
      },
      data: {
        status: 'ignored',
        respondedAt: new Date(),
      },
    });
  }

  async unblockUser(userId: string, blockedId: string): Promise<void> {
    await this.prisma.userBlock.deleteMany({
      where: {
        blockerId: userId,
        blockedId,
      },
    });
  }

  async getBlockedUsers(userId: string): Promise<string[]> {
    const blocks = await this.prisma.userBlock.findMany({
      where: { blockerId: userId },
    });
    return blocks.map(b => b.blockedId);
  }

  async expireOldRequests(): Promise<number> {
    const result = await this.prisma.rematchRequest.updateMany({
      where: {
        status: 'pending',
        expiresAt: { lt: new Date() },
      },
      data: { status: 'expired' },
    });
    return result.count;
  }

  private async enrichRequests(
    requests: any[],
    currentUserId: string,
    otherUserField: 'from' | 'to',
  ): Promise<RematchRequestResponseDto[]> {
    return Promise.all(requests.map(r => this.enrichRequest(r, currentUserId, otherUserField)));
  }

  private async enrichRequest(
    request: any,
    currentUserId: string,
    otherUserField?: 'from' | 'to',
  ): Promise<RematchRequestResponseDto> {
    const otherUserId =
      otherUserField === 'from'
        ? request.fromUserId
        : otherUserField === 'to'
        ? request.toUserId
        : request.fromUserId === currentUserId
        ? request.toUserId
        : request.fromUserId;

    const [otherUser, event] = await Promise.all([
      this.prisma.user.findUnique({
        where: { id: otherUserId },
        select: {
          id: true,
          name: true,
          instagramUsername: true,
          profilePicture: true,
          bio: true,
        },
      }),
      this.prisma.event.findUnique({
        where: { id: request.eventId },
        select: {
          id: true,
          name: true,
          locationName: true,
          startDate: true,
          endDate: true,
        },
      }),
    ]);

    return {
      id: request.id,
      fromUserId: request.fromUserId,
      toUserId: request.toUserId,
      eventId: request.eventId,
      message: request.message,
      status: request.status,
      createdAt: request.createdAt,
      respondedAt: request.respondedAt,
      expiresAt: request.expiresAt,
      otherUser: otherUser!,
      event: event!,
    };
  }
}
