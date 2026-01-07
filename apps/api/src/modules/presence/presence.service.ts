import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';
import {
  ConfirmPresenceDto,
  CheckInDto,
  QrCheckInDto,
  UpdateIntentionsDto,
  PresenceResponseDto,
  CheckInResultDto,
} from './dto/presence.dto';

@Injectable()
export class PresenceService {
  constructor(private prisma: PrismaService) {}

  async confirmPresence(
    userId: string,
    dto: ConfirmPresenceDto,
  ): Promise<PresenceResponseDto> {
    // Verify event exists and is upcoming
    const event = await this.prisma.event.findUnique({
      where: { id: dto.eventId },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    if (event.endDate < new Date()) {
      throw new BadRequestException('Cannot confirm presence for past events');
    }

    // Validate intentions against allowed interactions
    const invalidIntentions = dto.intentions.filter(
      (i) => !event.allowedInteractions.includes(i),
    );

    if (invalidIntentions.length > 0) {
      throw new BadRequestException(
        `Invalid intentions for this event: ${invalidIntentions.join(', ')}`,
      );
    }

    // Check if already confirmed
    const existing = await this.prisma.presence.findUnique({
      where: {
        userId_eventId: { userId, eventId: dto.eventId },
      },
    });

    if (existing) {
      throw new ConflictException('Already confirmed presence at this event');
    }

    const presence = await this.prisma.presence.create({
      data: {
        userId,
        eventId: dto.eventId,
        intentions: dto.intentions,
        status: dto.status,
      },
      include: {
        event: {
          select: {
            id: true,
            name: true,
            startDate: true,
            endDate: true,
            locationName: true,
            imageUrl: true,
          },
        },
      },
    });

    return this.mapToResponse(presence);
  }

  async checkIn(userId: string, dto: CheckInDto): Promise<CheckInResultDto> {
    // Verify presence exists
    const presence = await this.prisma.presence.findUnique({
      where: {
        userId_eventId: { userId, eventId: dto.eventId },
      },
      include: {
        event: true,
      },
    });

    if (!presence) {
      throw new NotFoundException('Presence not confirmed for this event');
    }

    if (presence.checkedInAt) {
      throw new ConflictException('Already checked in');
    }

    const event = presence.event;
    const now = new Date();

    // Check if event is active (within time window)
    // Allow check-in 30 minutes before start and until end
    const checkInStart = new Date(event.startDate.getTime() - 30 * 60 * 1000);
    if (now < checkInStart) {
      throw new BadRequestException(
        'Check-in not yet available. Opens 30 minutes before event start.',
      );
    }

    if (now > event.endDate) {
      throw new BadRequestException('Event has ended');
    }

    // Validate GPS location
    const distance = this.calculateDistance(
      dto.latitude,
      dto.longitude,
      event.latitude,
      event.longitude,
    );

    const distanceMeters = distance * 1000;
    const allowedRadius = Math.max(event.gpsRadius, 200); // Minimum 200m

    if (distanceMeters > allowedRadius) {
      throw new BadRequestException(
        `You are ${Math.round(distanceMeters)}m from the event. ` +
          `Check-in requires being within ${allowedRadius}m.`,
      );
    }

    // Perform check-in
    const updated = await this.prisma.presence.update({
      where: { id: presence.id },
      data: { checkedInAt: now },
      include: {
        event: {
          select: {
            id: true,
            name: true,
            startDate: true,
            endDate: true,
            locationName: true,
            imageUrl: true,
          },
        },
      },
    });

    // Count active users at this event
    const activeUsers = await this.prisma.presence.count({
      where: {
        eventId: dto.eventId,
        checkedInAt: { not: null },
        checkedOutAt: null,
      },
    });

    return {
      success: true,
      presence: this.mapToResponse(updated),
      activeUsers,
    };
  }

  async checkInWithQr(userId: string, dto: QrCheckInDto): Promise<CheckInResultDto> {
    // Parse QR code - can be event ID directly or encrypted data
    let eventId: string;

    try {
      // Try parsing as JSON first (encrypted format)
      const qrData = JSON.parse(dto.qrCode);
      eventId = qrData.eventId || qrData.id;
    } catch {
      // Assume it's a plain event ID
      eventId = dto.qrCode;
    }

    // Delegate to regular check-in with validated event ID
    return this.checkIn(userId, {
      eventId,
      latitude: dto.latitude,
      longitude: dto.longitude,
    });
  }

  async checkOut(userId: string, eventId: string): Promise<PresenceResponseDto> {
    const presence = await this.prisma.presence.findUnique({
      where: {
        userId_eventId: { userId, eventId },
      },
    });

    if (!presence) {
      throw new NotFoundException('Presence not found');
    }

    if (!presence.checkedInAt) {
      throw new BadRequestException('Not checked in');
    }

    if (presence.checkedOutAt) {
      throw new ConflictException('Already checked out');
    }

    const updated = await this.prisma.presence.update({
      where: { id: presence.id },
      data: { checkedOutAt: new Date() },
      include: {
        event: {
          select: {
            id: true,
            name: true,
            startDate: true,
            endDate: true,
            locationName: true,
            imageUrl: true,
          },
        },
      },
    });

    return this.mapToResponse(updated);
  }

  async updateIntentions(
    userId: string,
    eventId: string,
    dto: UpdateIntentionsDto,
  ): Promise<PresenceResponseDto> {
    const presence = await this.prisma.presence.findUnique({
      where: {
        userId_eventId: { userId, eventId },
      },
      include: { event: true },
    });

    if (!presence) {
      throw new NotFoundException('Presence not found');
    }

    // Validate intentions
    const invalidIntentions = dto.intentions.filter(
      (i) => !presence.event.allowedInteractions.includes(i),
    );

    if (invalidIntentions.length > 0) {
      throw new BadRequestException(
        `Invalid intentions for this event: ${invalidIntentions.join(', ')}`,
      );
    }

    const updated = await this.prisma.presence.update({
      where: { id: presence.id },
      data: { intentions: dto.intentions },
      include: {
        event: {
          select: {
            id: true,
            name: true,
            startDate: true,
            endDate: true,
            locationName: true,
            imageUrl: true,
          },
        },
      },
    });

    return this.mapToResponse(updated);
  }

  async cancelPresence(userId: string, eventId: string): Promise<void> {
    const presence = await this.prisma.presence.findUnique({
      where: {
        userId_eventId: { userId, eventId },
      },
    });

    if (!presence) {
      throw new NotFoundException('Presence not found');
    }

    if (presence.checkedInAt) {
      throw new BadRequestException(
        'Cannot cancel after check-in. Please check out instead.',
      );
    }

    await this.prisma.presence.delete({ where: { id: presence.id } });
  }

  async getUserPresences(
    userId: string,
    filter?: 'upcoming' | 'past' | 'active',
  ): Promise<PresenceResponseDto[]> {
    const now = new Date();

    let where: object = { userId };

    if (filter === 'upcoming') {
      where = {
        userId,
        event: { startDate: { gt: now } },
      };
    } else if (filter === 'past') {
      where = {
        userId,
        event: { endDate: { lt: now } },
      };
    } else if (filter === 'active') {
      where = {
        userId,
        checkedInAt: { not: null },
        checkedOutAt: null,
        event: { endDate: { gte: now } },
      };
    }

    const presences = await this.prisma.presence.findMany({
      where,
      include: {
        event: {
          select: {
            id: true,
            name: true,
            startDate: true,
            endDate: true,
            locationName: true,
            imageUrl: true,
          },
        },
      },
      orderBy: { event: { startDate: 'asc' } },
    });

    return presences.map(this.mapToResponse);
  }

  async getEventAttendees(eventId: string, checkedInOnly = false) {
    const where: object = checkedInOnly
      ? { eventId, checkedInAt: { not: null }, checkedOutAt: null }
      : { eventId };

    return this.prisma.presence.findMany({
      where,
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
  }

  private mapToResponse(
    presence: {
      id: string;
      userId: string;
      eventId: string;
      intentions: string[];
      status: string | null;
      confirmedAt: Date;
      checkedInAt: Date | null;
      checkedOutAt: Date | null;
      event?: {
        id: string;
        name: string;
        startDate: Date;
        endDate: Date;
        locationName: string;
        imageUrl: string | null;
      };
    },
  ): PresenceResponseDto {
    return {
      id: presence.id,
      userId: presence.userId,
      eventId: presence.eventId,
      intentions: presence.intentions,
      status: presence.status,
      confirmedAt: presence.confirmedAt,
      checkedInAt: presence.checkedInAt,
      checkedOutAt: presence.checkedOutAt,
      event: presence.event,
    };
  }

  // Haversine formula for distance calculation (returns km)
  private calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number {
    const R = 6371;
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) *
        Math.cos(this.toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRad(deg: number): number {
    return deg * (Math.PI / 180);
  }
}
