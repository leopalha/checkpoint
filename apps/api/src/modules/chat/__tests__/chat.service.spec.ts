import { Test, TestingModule } from '@nestjs/testing';
import {
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';

import { ChatService } from '../chat.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { NotificationsService } from '../../notifications/notifications.service';

describe('ChatService', () => {
  let service: ChatService;

  const mockPrismaService = {
    match: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
    },
    message: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      count: jest.fn(),
      updateMany: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
    },
  };

  const mockNotificationsService = {
    notifyNewMessage: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: NotificationsService, useValue: mockNotificationsService },
      ],
    }).compile();

    service = module.get<ChatService>(ChatService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getConversations', () => {
    it('should return conversations for user', async () => {
      const mockMatches = [
        {
          id: 'match-1',
          user1Id: 'user-1',
          user2Id: 'user-2',
          interactionType: 'fire',
          expiresAt: new Date(Date.now() + 86400000),
          updatedAt: new Date(),
          user1: {
            id: 'user-1',
            name: 'User 1',
            instagramUsername: 'user1',
            profilePicture: null,
          },
          user2: {
            id: 'user-2',
            name: 'User 2',
            instagramUsername: 'user2',
            profilePicture: null,
          },
          event: {
            id: 'event-1',
            name: 'Test Event',
          },
          messages: [
            {
              id: 'msg-1',
              content: 'Hello',
              senderId: 'user-2',
              createdAt: new Date(),
            },
          ],
        },
      ];

      mockPrismaService.match.findMany.mockResolvedValue(mockMatches);
      mockPrismaService.message.count.mockResolvedValue(2);

      const result = await service.getConversations('user-1');

      expect(result).toHaveLength(1);
      expect(result[0].matchId).toBe('match-1');
      expect(result[0].otherUser.id).toBe('user-2');
      expect(result[0].unreadCount).toBe(2);
    });

    it('should return empty array when no conversations', async () => {
      mockPrismaService.match.findMany.mockResolvedValue([]);

      const result = await service.getConversations('user-1');

      expect(result).toHaveLength(0);
    });
  });

  describe('getMessages', () => {
    const mockMatch = {
      id: 'match-1',
      user1Id: 'user-1',
      user2Id: 'user-2',
      status: 'revealed',
      expiresAt: new Date(Date.now() + 86400000),
    };

    it('should return messages for valid match', async () => {
      mockPrismaService.match.findUnique.mockResolvedValue(mockMatch);
      mockPrismaService.message.findMany.mockResolvedValue([
        {
          id: 'msg-1',
          matchId: 'match-1',
          senderId: 'user-1',
          content: 'Hello',
          readAt: null,
          createdAt: new Date(),
        },
      ]);

      const result = await service.getMessages('user-1', 'match-1');

      expect(result).toHaveLength(1);
      expect(result[0].isOwn).toBe(true);
    });

    it('should throw NotFoundException for non-existent match', async () => {
      mockPrismaService.match.findUnique.mockResolvedValue(null);

      await expect(
        service.getMessages('user-1', 'non-existent'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if user not part of match', async () => {
      mockPrismaService.match.findUnique.mockResolvedValue(mockMatch);

      await expect(
        service.getMessages('user-3', 'match-1'),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw BadRequestException if match not revealed', async () => {
      mockPrismaService.match.findUnique.mockResolvedValue({
        ...mockMatch,
        status: 'pending',
      });

      await expect(
        service.getMessages('user-1', 'match-1'),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if match expired', async () => {
      mockPrismaService.match.findUnique.mockResolvedValue({
        ...mockMatch,
        expiresAt: new Date(Date.now() - 86400000), // Yesterday
      });

      await expect(
        service.getMessages('user-1', 'match-1'),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('sendMessage', () => {
    const mockMatch = {
      id: 'match-1',
      user1Id: 'user-1',
      user2Id: 'user-2',
      status: 'revealed',
      expiresAt: new Date(Date.now() + 86400000),
    };

    it('should send message successfully', async () => {
      mockPrismaService.match.findUnique.mockResolvedValue(mockMatch);
      mockPrismaService.user.findUnique.mockResolvedValue({ name: 'Test User' });
      mockPrismaService.message.create.mockResolvedValue({
        id: 'msg-1',
        matchId: 'match-1',
        senderId: 'user-1',
        content: 'Hello',
        createdAt: new Date(),
      });
      mockPrismaService.match.update.mockResolvedValue(mockMatch);
      mockNotificationsService.notifyNewMessage.mockResolvedValue(true);

      const result = await service.sendMessage('user-1', {
        matchId: 'match-1',
        content: 'Hello',
      });

      expect(result.id).toBe('msg-1');
      expect(result.isOwn).toBe(true);
    });

    it('should throw NotFoundException for non-existent match', async () => {
      mockPrismaService.match.findUnique.mockResolvedValue(null);

      await expect(
        service.sendMessage('user-1', {
          matchId: 'non-existent',
          content: 'Hello',
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if user not part of match', async () => {
      mockPrismaService.match.findUnique.mockResolvedValue(mockMatch);

      await expect(
        service.sendMessage('user-3', {
          matchId: 'match-1',
          content: 'Hello',
        }),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw BadRequestException if match expired', async () => {
      mockPrismaService.match.findUnique.mockResolvedValue({
        ...mockMatch,
        expiresAt: new Date(Date.now() - 86400000),
      });

      await expect(
        service.sendMessage('user-1', {
          matchId: 'match-1',
          content: 'Hello',
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('markMessagesAsRead', () => {
    const mockMatch = {
      id: 'match-1',
      user1Id: 'user-1',
      user2Id: 'user-2',
    };

    it('should mark messages as read', async () => {
      mockPrismaService.match.findUnique.mockResolvedValue(mockMatch);
      mockPrismaService.message.findUnique.mockResolvedValue({
        id: 'msg-1',
        createdAt: new Date(),
      });
      mockPrismaService.message.updateMany.mockResolvedValue({ count: 3 });

      const result = await service.markMessagesAsRead(
        'user-1',
        'match-1',
        'msg-1',
      );

      expect(result.count).toBe(3);
    });

    it('should throw NotFoundException if match not found', async () => {
      mockPrismaService.match.findUnique.mockResolvedValue(null);

      await expect(
        service.markMessagesAsRead('user-1', 'non-existent', 'msg-1'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if user not part of match', async () => {
      mockPrismaService.match.findUnique.mockResolvedValue(mockMatch);

      await expect(
        service.markMessagesAsRead('user-3', 'match-1', 'msg-1'),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw NotFoundException if message not found', async () => {
      mockPrismaService.match.findUnique.mockResolvedValue(mockMatch);
      mockPrismaService.message.findUnique.mockResolvedValue(null);

      await expect(
        service.markMessagesAsRead('user-1', 'match-1', 'non-existent'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('getUnreadCount', () => {
    it('should return unread count', async () => {
      mockPrismaService.match.findMany.mockResolvedValue([
        { id: 'match-1' },
        { id: 'match-2' },
      ]);
      mockPrismaService.message.count.mockResolvedValue(5);

      const result = await service.getUnreadCount('user-1');

      expect(result).toBe(5);
    });

    it('should return 0 when no matches', async () => {
      mockPrismaService.match.findMany.mockResolvedValue([]);

      const result = await service.getUnreadCount('user-1');

      expect(result).toBe(0);
    });
  });

  describe('getConversationDetails', () => {
    it('should return conversation details', async () => {
      const mockMatch = {
        id: 'match-1',
        user1Id: 'user-1',
        user2Id: 'user-2',
        interactionType: 'fire',
        expiresAt: new Date(Date.now() + 86400000),
        user1: {
          id: 'user-1',
          name: 'User 1',
          instagramUsername: 'user1',
          profilePicture: null,
        },
        user2: {
          id: 'user-2',
          name: 'User 2',
          instagramUsername: 'user2',
          profilePicture: null,
        },
        event: {
          id: 'event-1',
          name: 'Test Event',
        },
      };

      mockPrismaService.match.findUnique.mockResolvedValue(mockMatch);

      const result = await service.getConversationDetails('user-1', 'match-1');

      expect(result.match.id).toBe('match-1');
      expect(result.otherUser.id).toBe('user-2');
      expect(result.event.name).toBe('Test Event');
    });

    it('should throw NotFoundException for non-existent match', async () => {
      mockPrismaService.match.findUnique.mockResolvedValue(null);

      await expect(
        service.getConversationDetails('user-1', 'non-existent'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if user not part of match', async () => {
      mockPrismaService.match.findUnique.mockResolvedValue({
        id: 'match-1',
        user1Id: 'user-1',
        user2Id: 'user-2',
        user1: {},
        user2: {},
        event: {},
      });

      await expect(
        service.getConversationDetails('user-3', 'match-1'),
      ).rejects.toThrow(ForbiddenException);
    });
  });
});
