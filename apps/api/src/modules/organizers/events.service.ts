import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { randomBytes } from 'crypto';

import { PrismaService } from '../../prisma/prisma.service';
import {
  CreateEventDto,
  UpdateEventDto,
  EventResponseDto,
} from './dto/event.dto';

@Injectable()
export class OrganizerEventsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Create a new event
   */
  async createEvent(
    organizerId: string,
    dto: CreateEventDto,
  ): Promise<EventResponseDto> {
    // Validate dates
    const startDate = new Date(dto.startDate);
    const endDate = new Date(dto.endDate);

    if (startDate >= endDate) {
      throw new BadRequestException('Data de início deve ser antes da data de fim');
    }

    if (startDate < new Date()) {
      throw new BadRequestException('Evento não pode começar no passado');
    }

    // Generate unique QR code
    const qrCode = this.generateQRCode();

    const event = await this.prisma.event.create({
      data: {
        name: dto.name,
        description: dto.description || null,
        imageUrl: dto.imageUrl || null,
        startDate,
        endDate,
        locationName: dto.locationName,
        locationAddress: dto.locationAddress,
        latitude: dto.latitude,
        longitude: dto.longitude,
        themeId: dto.themeId || 'social',
        allowedInteractions: dto.allowedInteractions || ['fire', 'handshake', 'highfive'],
        gpsRadius: Math.max(200, dto.gpsRadius || 500),
        qrCode,
        organizerId,
      },
    });

    return this.formatEvent(event);
  }

  /**
   * Update an event
   */
  async updateEvent(
    organizerId: string,
    eventId: string,
    dto: UpdateEventDto,
  ): Promise<EventResponseDto> {
    // Verify ownership
    const existing = await this.prisma.event.findFirst({
      where: { id: eventId, organizerId },
    });

    if (!existing) {
      throw new NotFoundException('Evento não encontrado');
    }

    // Validate dates if provided
    const startDate = dto.startDate ? new Date(dto.startDate) : existing.startDate;
    const endDate = dto.endDate ? new Date(dto.endDate) : existing.endDate;

    if (startDate >= endDate) {
      throw new BadRequestException('Data de início deve ser antes da data de fim');
    }

    const event = await this.prisma.event.update({
      where: { id: eventId },
      data: {
        name: dto.name,
        description: dto.description,
        imageUrl: dto.imageUrl,
        startDate: dto.startDate ? new Date(dto.startDate) : undefined,
        endDate: dto.endDate ? new Date(dto.endDate) : undefined,
        locationName: dto.locationName,
        locationAddress: dto.locationAddress,
        latitude: dto.latitude,
        longitude: dto.longitude,
        themeId: dto.themeId,
        allowedInteractions: dto.allowedInteractions,
        gpsRadius: dto.gpsRadius ? Math.max(200, dto.gpsRadius) : undefined,
      },
    });

    return this.formatEvent(event);
  }

  /**
   * Delete an event
   */
  async deleteEvent(organizerId: string, eventId: string): Promise<void> {
    // Verify ownership
    const existing = await this.prisma.event.findFirst({
      where: { id: eventId, organizerId },
    });

    if (!existing) {
      throw new NotFoundException('Evento não encontrado');
    }

    // Check if event has check-ins (can't delete)
    const checkInCount = await this.prisma.presence.count({
      where: { eventId, checkedInAt: { not: null } },
    });

    if (checkInCount > 0) {
      throw new BadRequestException(
        'Não é possível excluir evento com check-ins realizados',
      );
    }

    // Delete all related data (cascade should handle this, but be explicit)
    await this.prisma.$transaction([
      this.prisma.message.deleteMany({
        where: { match: { eventId } },
      }),
      this.prisma.match.deleteMany({ where: { eventId } }),
      this.prisma.interaction.deleteMany({ where: { eventId } }),
      this.prisma.presence.deleteMany({ where: { eventId } }),
      this.prisma.event.delete({ where: { id: eventId } }),
    ]);
  }

  /**
   * Get event by ID
   */
  async getEventById(
    organizerId: string,
    eventId: string,
  ): Promise<EventResponseDto> {
    const event = await this.prisma.event.findFirst({
      where: { id: eventId, organizerId },
      include: {
        _count: {
          select: {
            presences: true,
            interactions: true,
            matches: true,
          },
        },
      },
    });

    if (!event) {
      throw new NotFoundException('Evento não encontrado');
    }

    return {
      ...this.formatEvent(event),
      stats: {
        presences: event._count.presences,
        interactions: event._count.interactions,
        matches: event._count.matches,
      },
    };
  }

  /**
   * Regenerate QR code for an event
   */
  async regenerateQRCode(
    organizerId: string,
    eventId: string,
  ): Promise<{ qrCode: string }> {
    const existing = await this.prisma.event.findFirst({
      where: { id: eventId, organizerId },
    });

    if (!existing) {
      throw new NotFoundException('Evento não encontrado');
    }

    const qrCode = this.generateQRCode();

    await this.prisma.event.update({
      where: { id: eventId },
      data: { qrCode },
    });

    return { qrCode };
  }

  /**
   * Get event attendees list
   */
  async getEventAttendees(organizerId: string, eventId: string) {
    const event = await this.prisma.event.findFirst({
      where: { id: eventId, organizerId },
    });

    if (!event) {
      throw new NotFoundException('Evento não encontrado');
    }

    const presences = await this.prisma.presence.findMany({
      where: { eventId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            instagramUsername: true,
            profilePicture: true,
          },
        },
      },
      orderBy: { confirmedAt: 'desc' },
    });

    return presences.map((p) => ({
      userId: p.user.id,
      name: p.user.name,
      instagramUsername: p.user.instagramUsername,
      profilePicture: p.user.profilePicture,
      intentions: p.intentions,
      confirmedAt: p.confirmedAt.toISOString(),
      checkedInAt: p.checkedInAt?.toISOString() || null,
    }));
  }

  private generateQRCode(): string {
    return randomBytes(16).toString('hex').toUpperCase();
  }

  private formatEvent(event: {
    id: string;
    name: string;
    description: string | null;
    imageUrl: string | null;
    startDate: Date;
    endDate: Date;
    locationName: string;
    locationAddress: string;
    latitude: number;
    longitude: number;
    themeId: string;
    allowedInteractions: string[];
    gpsRadius: number;
    qrCode: string | null;
    createdAt: Date;
  }): EventResponseDto {
    return {
      id: event.id,
      name: event.name,
      description: event.description,
      imageUrl: event.imageUrl,
      startDate: event.startDate.toISOString(),
      endDate: event.endDate.toISOString(),
      locationName: event.locationName,
      locationAddress: event.locationAddress,
      latitude: event.latitude,
      longitude: event.longitude,
      themeId: event.themeId,
      allowedInteractions: event.allowedInteractions,
      gpsRadius: event.gpsRadius,
      qrCode: event.qrCode,
      createdAt: event.createdAt.toISOString(),
    };
  }
}
