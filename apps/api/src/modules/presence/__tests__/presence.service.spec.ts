import { Test, TestingModule } from '@nestjs/testing';
import {
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';

import { PresenceService } from '../presence.service';
import { PrismaService } from '../../../prisma/prisma.service';

describe('PresenceService', () => {
  let service: PresenceService;

  const mockPrismaService = {
    event: {
      findUnique: jest.fn(),
    },
    presence: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PresenceService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<PresenceService>(PresenceService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('confirmPresence', () => {
    const mockEvent = {
      id: 'event-123',
      name: 'Test Event',
      endDate: new Date(Date.now() + 86400000), // Tomorrow
      allowedInteractions: ['fire', 'handshake', 'highfive'],
    };

    it('should confirm presence successfully', async () => {
      mockPrismaService.event.findUnique.mockResolvedValue(mockEvent);
      mockPrismaService.presence.findUnique.mockResolvedValue(null);
      mockPrismaService.presence.create.mockResolvedValue({
        id: 'presence-123',
        userId: 'user-123',
        eventId: 'event-123',
        intentions: ['fire', 'handshake'],
        status: null,
        confirmedAt: new Date(),
        checkedInAt: null,
        checkedOutAt: null,
        event: {
          id: 'event-123',
          name: 'Test Event',
          startDate: new Date(),
          endDate: new Date(),
          locationName: 'Test Location',
          imageUrl: null,
        },
      });

      const result = await service.confirmPresence('user-123', {
        eventId: 'event-123',
        intentions: ['fire', 'handshake'],
      });

      expect(result.eventId).toBe('event-123');
      expect(result.intentions).toEqual(['fire', 'handshake']);
    });

    it('should throw NotFoundException for non-existent event', async () => {
      mockPrismaService.event.findUnique.mockResolvedValue(null);

      await expect(
        service.confirmPresence('user-123', {
          eventId: 'non-existent',
          intentions: ['fire'],
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException for past event', async () => {
      mockPrismaService.event.findUnique.mockResolvedValue({
        ...mockEvent,
        endDate: new Date(Date.now() - 86400000), // Yesterday
      });

      await expect(
        service.confirmPresence('user-123', {
          eventId: 'event-123',
          intentions: ['fire'],
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException for invalid intentions', async () => {
      mockPrismaService.event.findUnique.mockResolvedValue(mockEvent);

      await expect(
        service.confirmPresence('user-123', {
          eventId: 'event-123',
          intentions: ['invalid_intention'],
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw ConflictException if already confirmed', async () => {
      mockPrismaService.event.findUnique.mockResolvedValue(mockEvent);
      mockPrismaService.presence.findUnique.mockResolvedValue({
        id: 'existing-presence',
      });

      await expect(
        service.confirmPresence('user-123', {
          eventId: 'event-123',
          intentions: ['fire'],
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('checkIn', () => {
    const eventLocation = { latitude: -23.5505, longitude: -46.6333 }; // São Paulo

    const mockPresenceWithEvent = {
      id: 'presence-123',
      userId: 'user-123',
      eventId: 'event-123',
      checkedInAt: null,
      event: {
        id: 'event-123',
        name: 'Test Event',
        startDate: new Date(Date.now() - 3600000), // 1 hour ago
        endDate: new Date(Date.now() + 3600000), // 1 hour from now
        latitude: eventLocation.latitude,
        longitude: eventLocation.longitude,
        gpsRadius: 500,
        locationName: 'Test Location',
        imageUrl: null,
      },
    };

    it('should check in successfully when within radius', async () => {
      mockPrismaService.presence.findUnique.mockResolvedValue(mockPresenceWithEvent);
      mockPrismaService.presence.update.mockResolvedValue({
        ...mockPresenceWithEvent,
        checkedInAt: new Date(),
      });
      mockPrismaService.presence.count.mockResolvedValue(5);

      // User is at exact event location
      const result = await service.checkIn('user-123', {
        eventId: 'event-123',
        latitude: eventLocation.latitude,
        longitude: eventLocation.longitude,
      });

      expect(result.success).toBe(true);
      expect(result.activeUsers).toBe(5);
    });

    it('should throw NotFoundException if presence not confirmed', async () => {
      mockPrismaService.presence.findUnique.mockResolvedValue(null);

      await expect(
        service.checkIn('user-123', {
          eventId: 'event-123',
          latitude: eventLocation.latitude,
          longitude: eventLocation.longitude,
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ConflictException if already checked in', async () => {
      mockPrismaService.presence.findUnique.mockResolvedValue({
        ...mockPresenceWithEvent,
        checkedInAt: new Date(),
      });

      await expect(
        service.checkIn('user-123', {
          eventId: 'event-123',
          latitude: eventLocation.latitude,
          longitude: eventLocation.longitude,
        }),
      ).rejects.toThrow(ConflictException);
    });

    it('should throw BadRequestException when too far from event', async () => {
      mockPrismaService.presence.findUnique.mockResolvedValue(mockPresenceWithEvent);

      // User is in Rio de Janeiro (far from São Paulo)
      await expect(
        service.checkIn('user-123', {
          eventId: 'event-123',
          latitude: -22.9068,
          longitude: -43.1729,
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when event has not started', async () => {
      mockPrismaService.presence.findUnique.mockResolvedValue({
        ...mockPresenceWithEvent,
        event: {
          ...mockPresenceWithEvent.event,
          startDate: new Date(Date.now() + 7200000), // 2 hours from now
        },
      });

      await expect(
        service.checkIn('user-123', {
          eventId: 'event-123',
          latitude: eventLocation.latitude,
          longitude: eventLocation.longitude,
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when event has ended', async () => {
      mockPrismaService.presence.findUnique.mockResolvedValue({
        ...mockPresenceWithEvent,
        event: {
          ...mockPresenceWithEvent.event,
          endDate: new Date(Date.now() - 3600000), // 1 hour ago
        },
      });

      await expect(
        service.checkIn('user-123', {
          eventId: 'event-123',
          latitude: eventLocation.latitude,
          longitude: eventLocation.longitude,
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('cancelPresence', () => {
    it('should cancel presence successfully', async () => {
      mockPrismaService.presence.findUnique.mockResolvedValue({
        id: 'presence-123',
        checkedInAt: null,
      });
      mockPrismaService.presence.delete.mockResolvedValue({});

      await expect(
        service.cancelPresence('user-123', 'event-123'),
      ).resolves.not.toThrow();
    });

    it('should throw NotFoundException if presence not found', async () => {
      mockPrismaService.presence.findUnique.mockResolvedValue(null);

      await expect(
        service.cancelPresence('user-123', 'event-123'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if already checked in', async () => {
      mockPrismaService.presence.findUnique.mockResolvedValue({
        id: 'presence-123',
        checkedInAt: new Date(),
      });

      await expect(
        service.cancelPresence('user-123', 'event-123'),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('GPS validation', () => {
    it('should enforce minimum 200m radius', async () => {
      const mockPresence = {
        id: 'presence-123',
        userId: 'user-123',
        eventId: 'event-123',
        checkedInAt: null,
        event: {
          id: 'event-123',
          name: 'Test Event',
          startDate: new Date(Date.now() - 3600000),
          endDate: new Date(Date.now() + 3600000),
          latitude: -23.5505,
          longitude: -46.6333,
          gpsRadius: 100, // Less than minimum
          locationName: 'Test',
          imageUrl: null,
        },
      };

      mockPrismaService.presence.findUnique.mockResolvedValue(mockPresence);

      // User is 150m away (should pass because minimum is 200m)
      // ~0.0013 degrees is roughly 150m at this latitude
      mockPrismaService.presence.update.mockResolvedValue({
        ...mockPresence,
        checkedInAt: new Date(),
      });
      mockPrismaService.presence.count.mockResolvedValue(1);

      const result = await service.checkIn('user-123', {
        eventId: 'event-123',
        latitude: -23.5505 + 0.0013,
        longitude: -46.6333,
      });

      expect(result.success).toBe(true);
    });
  });
});
