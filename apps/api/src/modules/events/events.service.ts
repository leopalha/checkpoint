import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';
import {
  CreateEventDto,
  UpdateEventDto,
  NearbyEventsQueryDto,
  EventListQueryDto,
  SearchEventsQueryDto,
  EventResponseDto,
} from './dto/event.dto';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  async create(organizerId: string, dto: CreateEventDto): Promise<EventResponseDto> {
    const event = await this.prisma.event.create({
      data: {
        name: dto.name,
        description: dto.description,
        imageUrl: dto.imageUrl,
        startDate: new Date(dto.startDate),
        endDate: new Date(dto.endDate),
        locationName: dto.locationName,
        locationAddress: dto.locationAddress,
        latitude: dto.latitude,
        longitude: dto.longitude,
        themeId: dto.themeId || 'social',
        allowedInteractions: dto.allowedInteractions || ['fire', 'handshake', 'highfive'],
        gpsRadius: dto.gpsRadius || 500,
        organizerId,
      },
    });

    return this.mapToResponse(event);
  }

  async findById(id: string, userId?: string): Promise<EventResponseDto> {
    const event = await this.prisma.event.findUnique({
      where: { id },
      include: {
        _count: {
          select: { presences: true },
        },
      },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    let userPresence = null;
    if (userId) {
      const presence = await this.prisma.presence.findUnique({
        where: {
          userId_eventId: { userId, eventId: id },
        },
      });

      if (presence) {
        userPresence = {
          confirmed: true,
          checkedIn: !!presence.checkedInAt,
          intentions: presence.intentions,
        };
      }
    }

    return {
      ...this.mapToResponse(event),
      attendeeCount: event._count.presences,
      userPresence,
    };
  }

  async findUpcoming(query: EventListQueryDto): Promise<{
    events: EventResponseDto[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const now = new Date();
    const where =
      query.filter === 'past'
        ? { endDate: { lt: now } }
        : query.filter === 'all'
          ? {}
          : { endDate: { gte: now } };

    const [events, total] = await Promise.all([
      this.prisma.event.findMany({
        where,
        orderBy: { startDate: query.filter === 'past' ? 'desc' : 'asc' },
        skip,
        take: limit,
        include: {
          _count: {
            select: { presences: true },
          },
        },
      }),
      this.prisma.event.count({ where }),
    ]);

    return {
      events: events.map((e) => ({
        ...this.mapToResponse(e),
        attendeeCount: e._count.presences,
      })),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findNearby(
    query: NearbyEventsQueryDto,
    userId?: string,
  ): Promise<EventResponseDto[]> {
    const radiusKm = query.radius || 50;
    const now = new Date();

    // Haversine formula to calculate distance
    // This is a simplified version - for production, use PostGIS
    const events = await this.prisma.event.findMany({
      where: {
        endDate: { gte: now },
        ...(query.themeId && { themeId: query.themeId }),
      },
      include: {
        _count: {
          select: { presences: true },
        },
      },
    });

    // Calculate distance and filter
    const eventsWithDistance = events
      .map((event) => ({
        event,
        distance: this.calculateDistance(
          query.latitude,
          query.longitude,
          event.latitude,
          event.longitude,
        ),
      }))
      .filter((e) => e.distance <= radiusKm)
      .sort((a, b) => a.distance - b.distance);

    // Get user presences for these events
    let userPresences: Map<string, { checkedIn: boolean; intentions: string[] }> =
      new Map();

    if (userId) {
      const presences = await this.prisma.presence.findMany({
        where: {
          userId,
          eventId: { in: eventsWithDistance.map((e) => e.event.id) },
        },
      });

      userPresences = new Map(
        presences.map((p) => [
          p.eventId,
          { checkedIn: !!p.checkedInAt, intentions: p.intentions },
        ]),
      );
    }

    return eventsWithDistance.map(({ event, distance }) => ({
      ...this.mapToResponse(event),
      distance: Math.round(distance * 10) / 10, // Round to 1 decimal
      attendeeCount: event._count.presences,
      userPresence: userPresences.has(event.id)
        ? {
            confirmed: true,
            ...userPresences.get(event.id)!,
          }
        : null,
    }));
  }

  async update(
    id: string,
    organizerId: string,
    dto: UpdateEventDto,
  ): Promise<EventResponseDto> {
    const event = await this.prisma.event.findUnique({
      where: { id },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    if (event.organizerId !== organizerId) {
      throw new NotFoundException('Event not found');
    }

    const updated = await this.prisma.event.update({
      where: { id },
      data: {
        ...(dto.name && { name: dto.name }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.imageUrl !== undefined && { imageUrl: dto.imageUrl }),
        ...(dto.startDate && { startDate: new Date(dto.startDate) }),
        ...(dto.endDate && { endDate: new Date(dto.endDate) }),
        ...(dto.allowedInteractions && {
          allowedInteractions: dto.allowedInteractions,
        }),
        ...(dto.gpsRadius && { gpsRadius: dto.gpsRadius }),
      },
    });

    return this.mapToResponse(updated);
  }

  async delete(id: string, organizerId: string): Promise<void> {
    const event = await this.prisma.event.findUnique({
      where: { id },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    if (event.organizerId !== organizerId) {
      throw new NotFoundException('Event not found');
    }

    await this.prisma.event.delete({ where: { id } });
  }

  async getEventsByOrganizer(organizerId: string): Promise<EventResponseDto[]> {
    const events = await this.prisma.event.findMany({
      where: { organizerId },
      orderBy: { startDate: 'desc' },
      include: {
        _count: {
          select: { presences: true },
        },
      },
    });

    return events.map((e) => ({
      ...this.mapToResponse(e),
      attendeeCount: e._count.presences,
    }));
  }

  async search(query: SearchEventsQueryDto): Promise<{
    events: EventResponseDto[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const now = new Date();
    const searchTerm = query.q.toLowerCase();

    // Build where clause
    const timeFilter =
      query.filter === 'past'
        ? { endDate: { lt: now } }
        : query.filter === 'all'
          ? {}
          : { endDate: { gte: now } };

    const where = {
      ...timeFilter,
      ...(query.themeId && { themeId: query.themeId }),
      OR: [
        { name: { contains: searchTerm, mode: 'insensitive' as const } },
        { description: { contains: searchTerm, mode: 'insensitive' as const } },
        { locationName: { contains: searchTerm, mode: 'insensitive' as const } },
        { locationAddress: { contains: searchTerm, mode: 'insensitive' as const } },
      ],
    };

    const [events, total] = await Promise.all([
      this.prisma.event.findMany({
        where,
        orderBy: { startDate: query.filter === 'past' ? 'desc' : 'asc' },
        skip,
        take: limit,
        include: {
          _count: {
            select: { presences: true },
          },
        },
      }),
      this.prisma.event.count({ where }),
    ]);

    // Calculate distance if coordinates provided
    const eventsWithDistance = events.map((event) => {
      const response: EventResponseDto = {
        ...this.mapToResponse(event),
        attendeeCount: event._count.presences,
      };

      if (query.latitude && query.longitude) {
        response.distance = Math.round(
          this.calculateDistance(
            query.latitude,
            query.longitude,
            event.latitude,
            event.longitude,
          ) * 10
        ) / 10;
      }

      return response;
    });

    return {
      events: eventsWithDistance,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  private mapToResponse(event: {
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
  }): EventResponseDto {
    return {
      id: event.id,
      name: event.name,
      description: event.description,
      imageUrl: event.imageUrl,
      startDate: event.startDate,
      endDate: event.endDate,
      locationName: event.locationName,
      locationAddress: event.locationAddress,
      latitude: event.latitude,
      longitude: event.longitude,
      themeId: event.themeId,
      allowedInteractions: event.allowedInteractions,
      gpsRadius: event.gpsRadius,
    };
  }

  // Haversine formula for distance calculation
  private calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number {
    const R = 6371; // Earth's radius in km
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
