import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';

interface UpdateProfileDto {
  bio?: string;
  defaultIntentions?: string[];
}

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user || user.deletedAt) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async getPublicProfile(userId: string, currentUserId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        _count: {
          select: {
            presences: true,
            matchesAsUser1: { where: { status: 'revealed' } },
            matchesAsUser2: { where: { status: 'revealed' } },
          },
        },
      },
    });

    if (!user || user.deletedAt) {
      throw new NotFoundException('User not found');
    }

    // Check if there's a mutual match between users
    const mutualMatch = await this.prisma.match.findFirst({
      where: {
        status: 'revealed',
        OR: [
          { user1Id: currentUserId, user2Id: userId },
          { user1Id: userId, user2Id: currentUserId },
        ],
      },
    });

    // Only show full profile if there's a mutual match
    const hasMatch = !!mutualMatch;

    return {
      id: user.id,
      name: user.name,
      profilePicture: user.profilePicture,
      bio: hasMatch ? user.bio : null,
      instagramUsername: hasMatch ? user.instagramUsername : null,
      defaultIntentions: user.defaultIntentions,
      stats: {
        eventsAttended: user._count.presences,
        totalMatches: user._count.matchesAsUser1 + user._count.matchesAsUser2,
      },
      hasMatch,
      matchDetails: mutualMatch
        ? {
            matchId: mutualMatch.id,
            interactionType: mutualMatch.interactionType,
            revealedAt: mutualMatch.revealedAt,
          }
        : null,
    };
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        bio: dto.bio,
        defaultIntentions: dto.defaultIntentions,
      },
    });
  }

  async exportUserData(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        presences: {
          include: {
            event: {
              select: { id: true, name: true, startDate: true },
            },
          },
        },
        interactionsSent: {
          select: {
            id: true,
            type: true,
            createdAt: true,
            event: { select: { id: true, name: true } },
          },
        },
        matchesAsUser1: {
          select: {
            id: true,
            status: true,
            interactionType: true,
            revealedAt: true,
            expiresAt: true,
          },
        },
        matchesAsUser2: {
          select: {
            id: true,
            status: true,
            interactionType: true,
            revealedAt: true,
            expiresAt: true,
          },
        },
      },
    });

    if (!user || user.deletedAt) {
      throw new NotFoundException('User not found');
    }

    return {
      user: {
        id: user.id,
        name: user.name,
        instagramUsername: user.instagramUsername,
        profilePicture: user.profilePicture,
        bio: user.bio,
        defaultIntentions: user.defaultIntentions,
        createdAt: user.createdAt,
      },
      presences: user.presences.map((p) => ({
        eventId: p.event.id,
        eventName: p.event.name,
        eventDate: p.event.startDate,
        intentions: p.intentions,
        checkedInAt: p.checkedInAt,
        createdAt: p.createdAt,
      })),
      interactions: user.interactionsSent.map((i) => ({
        id: i.id,
        type: i.type,
        eventName: i.event.name,
        createdAt: i.createdAt,
      })),
      matches: [...user.matchesAsUser1, ...user.matchesAsUser2].map((m) => ({
        id: m.id,
        status: m.status,
        interactionType: m.interactionType,
        revealedAt: m.revealedAt,
        expiresAt: m.expiresAt,
      })),
      exportedAt: new Date(),
    };
  }

  async scheduleDeletion(userId: string) {
    const deletionDate = new Date();
    deletionDate.setDate(deletionDate.getDate() + 30); // 30 days grace period

    return this.prisma.user.update({
      where: { id: userId },
      data: {
        deletionScheduledAt: deletionDate,
      },
    });
  }

  async cancelDeletion(userId: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        deletionScheduledAt: null,
      },
    });
  }

  async processScheduledDeletions() {
    const usersToDelete = await this.prisma.user.findMany({
      where: {
        deletionScheduledAt: {
          lte: new Date(),
        },
        deletedAt: null,
      },
    });

    for (const user of usersToDelete) {
      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          deletedAt: new Date(),
          // Anonymize personal data
          name: 'Deleted User',
          bio: null,
          profilePicture: null,
          instagramUsername: `deleted_${user.id}`,
        },
      });
    }

    return usersToDelete.length;
  }
}
