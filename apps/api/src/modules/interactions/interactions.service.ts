import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';
import {
  SendInteractionDto,
  InteractionResponseDto,
  UserAtEventDto,
} from './dto/interaction.dto';

@Injectable()
export class InteractionsService {
  constructor(private prisma: PrismaService) {}

  async sendInteraction(
    fromUserId: string,
    dto: SendInteractionDto,
  ): Promise<InteractionResponseDto> {
    // Validate users are different
    if (fromUserId === dto.toUserId) {
      throw new BadRequestException('Cannot interact with yourself');
    }

    // Verify event exists
    const event = await this.prisma.event.findUnique({
      where: { id: dto.eventId },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    // Verify interaction type is allowed for this event
    if (!event.allowedInteractions.includes(dto.type)) {
      throw new BadRequestException(
        `Interaction type "${dto.type}" is not allowed at this event`,
      );
    }

    // Verify both users are checked in at the event
    const [fromPresence, toPresence] = await Promise.all([
      this.prisma.presence.findUnique({
        where: { userId_eventId: { userId: fromUserId, eventId: dto.eventId } },
      }),
      this.prisma.presence.findUnique({
        where: { userId_eventId: { userId: dto.toUserId, eventId: dto.eventId } },
      }),
    ]);

    if (!fromPresence?.checkedInAt) {
      throw new ForbiddenException('You must be checked in to interact');
    }

    if (!toPresence?.checkedInAt) {
      throw new BadRequestException('Target user is not checked in at this event');
    }

    // Check daily limit for non-premium users
    const fromUser = await this.prisma.user.findUnique({
      where: { id: fromUserId },
    });

    if (!fromUser) {
      throw new NotFoundException('User not found');
    }

    if (!fromUser.isPremium) {
      // Reset daily likes if needed
      const now = new Date();
      const resetTime = new Date(fromUser.dailyLikesResetAt);

      if (now.getTime() - resetTime.getTime() > 24 * 60 * 60 * 1000) {
        // More than 24 hours since last reset
        await this.prisma.user.update({
          where: { id: fromUserId },
          data: {
            dailyLikesRemaining: 10,
            dailyLikesResetAt: now,
          },
        });
        fromUser.dailyLikesRemaining = 10;
      }

      if (fromUser.dailyLikesRemaining <= 0) {
        throw new ForbiddenException(
          'Daily interaction limit reached. Upgrade to premium for unlimited interactions.',
        );
      }
    }

    // Check for existing interaction
    const existingInteraction = await this.prisma.interaction.findUnique({
      where: {
        fromUserId_toUserId_eventId: {
          fromUserId,
          toUserId: dto.toUserId,
          eventId: dto.eventId,
        },
      },
    });

    if (existingInteraction) {
      throw new BadRequestException('You already interacted with this user at this event');
    }

    // Create interaction
    const interaction = await this.prisma.interaction.create({
      data: {
        fromUserId,
        toUserId: dto.toUserId,
        eventId: dto.eventId,
        type: dto.type,
      },
    });

    // Decrement daily likes for non-premium users
    if (!fromUser.isPremium) {
      await this.prisma.user.update({
        where: { id: fromUserId },
        data: { dailyLikesRemaining: { decrement: 1 } },
      });
    }

    // Check for mutual interaction (match)
    const mutualInteraction = await this.prisma.interaction.findFirst({
      where: {
        fromUserId: dto.toUserId,
        toUserId: fromUserId,
        eventId: dto.eventId,
      },
    });

    let matchCreated = false;
    let matchId: string | undefined;

    if (mutualInteraction) {
      // Create match - use consistent ordering for user1/user2
      const [user1Id, user2Id] =
        fromUserId < dto.toUserId
          ? [fromUserId, dto.toUserId]
          : [dto.toUserId, fromUserId];

      // Check if match already exists
      const existingMatch = await this.prisma.match.findUnique({
        where: {
          user1Id_user2Id_eventId: { user1Id, user2Id, eventId: dto.eventId },
        },
      });

      if (!existingMatch) {
        const match = await this.prisma.match.create({
          data: {
            user1Id,
            user2Id,
            eventId: dto.eventId,
            interactionType: dto.type,
            status: 'pending', // Will be revealed when both check in
          },
        });
        matchCreated = true;
        matchId = match.id;
      }
    }

    return {
      id: interaction.id,
      fromUserId: interaction.fromUserId,
      toUserId: interaction.toUserId,
      eventId: interaction.eventId,
      type: interaction.type,
      createdAt: interaction.createdAt,
      matchCreated,
      matchId,
    };
  }

  async getUsersAtEvent(
    userId: string,
    eventId: string,
  ): Promise<UserAtEventDto[]> {
    // Get all checked-in users at the event except current user
    const presences = await this.prisma.presence.findMany({
      where: {
        eventId,
        checkedInAt: { not: null },
        checkedOutAt: null,
        userId: { not: userId },
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

    // Get interactions from current user to these users
    const interactions = await this.prisma.interaction.findMany({
      where: {
        fromUserId: userId,
        eventId,
        toUserId: { in: presences.map((p) => p.userId) },
      },
    });

    const interactionMap = new Map(
      interactions.map((i) => [i.toUserId, i.type]),
    );

    return presences.map((p) => ({
      id: p.user.id,
      name: p.user.name,
      instagramUsername: p.user.instagramUsername,
      profilePicture: p.user.profilePicture,
      bio: p.user.bio,
      intentions: p.intentions,
      alreadyInteracted: interactionMap.has(p.user.id),
      interactionType: interactionMap.get(p.user.id),
    }));
  }

  async getMyInteractions(
    userId: string,
    eventId?: string,
  ): Promise<{ sent: number; received: number; remaining: number }> {
    const where = eventId
      ? { fromUserId: userId, eventId }
      : { fromUserId: userId };

    const receivedWhere = eventId
      ? { toUserId: userId, eventId }
      : { toUserId: userId };

    const [sent, received, user] = await Promise.all([
      this.prisma.interaction.count({ where }),
      this.prisma.interaction.count({ where: receivedWhere }),
      this.prisma.user.findUnique({
        where: { id: userId },
        select: { isPremium: true, dailyLikesRemaining: true },
      }),
    ]);

    return {
      sent,
      received,
      remaining: user?.isPremium ? -1 : (user?.dailyLikesRemaining ?? 0),
    };
  }

  async undoInteraction(
    userId: string,
    interactionId: string,
  ): Promise<void> {
    const interaction = await this.prisma.interaction.findUnique({
      where: { id: interactionId },
    });

    if (!interaction) {
      throw new NotFoundException('Interaction not found');
    }

    if (interaction.fromUserId !== userId) {
      throw new ForbiddenException('Cannot undo other users interactions');
    }

    // Only allow undo within 5 minutes
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    if (interaction.createdAt < fiveMinutesAgo) {
      throw new BadRequestException('Can only undo interactions within 5 minutes');
    }

    await this.prisma.interaction.delete({ where: { id: interactionId } });

    // Restore daily like for non-premium users
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (user && !user.isPremium) {
      await this.prisma.user.update({
        where: { id: userId },
        data: { dailyLikesRemaining: { increment: 1 } },
      });
    }
  }
}
