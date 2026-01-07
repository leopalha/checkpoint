import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';

import { AuthService } from '../auth.service';
import { InstagramService } from '../instagram.service';
import { PrismaService } from '../../../prisma/prisma.service';

describe('AuthService', () => {
  let service: AuthService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    refreshToken: {
      create: jest.fn(),
      findUnique: jest.fn(),
      delete: jest.fn(),
      deleteMany: jest.fn(),
    },
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn((key: string, defaultValue?: string) => {
      const config: Record<string, string> = {
        JWT_SECRET: 'test-secret',
        JWT_EXPIRES_IN: '15m',
        JWT_REFRESH_EXPIRES_IN: '7d',
      };
      return config[key] || defaultValue;
    }),
  };

  const mockInstagramService = {
    exchangeCodeForToken: jest.fn(),
    getUserProfile: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
        { provide: InstagramService, useValue: mockInstagramService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);

    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user if found', async () => {
      const mockUser = {
        id: 'user-123',
        name: 'Test User',
        instagramUsername: 'testuser',
        deletedAt: null,
      };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.validateUser('user-123');

      expect(result).toEqual(mockUser);
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'user-123' },
      });
    });

    it('should throw UnauthorizedException if user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.validateUser('invalid-id')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException if user is deleted', async () => {
      const deletedUser = {
        id: 'user-123',
        deletedAt: new Date(),
      };

      mockPrismaService.user.findUnique.mockResolvedValue(deletedUser);

      await expect(service.validateUser('user-123')).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('refreshTokens', () => {
    it('should refresh tokens successfully', async () => {
      const mockToken = {
        id: 'token-id',
        userId: 'user-123',
        token: 'valid-refresh-token',
        expiresAt: new Date(Date.now() + 86400000), // 1 day from now
      };

      const mockUser = {
        id: 'user-123',
        instagramUsername: 'testuser',
        deletedAt: null,
      };

      mockPrismaService.refreshToken.findUnique.mockResolvedValue(mockToken);
      mockPrismaService.refreshToken.delete.mockResolvedValue(mockToken);
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      mockJwtService.sign
        .mockReturnValueOnce('new-access-token')
        .mockReturnValueOnce('new-refresh-token');
      mockPrismaService.refreshToken.create.mockResolvedValue({
        token: 'new-refresh-token',
      });

      const result = await service.refreshTokens('valid-refresh-token');

      expect(result.accessToken).toBe('new-access-token');
      expect(result.refreshToken).toBe('new-refresh-token');
    });

    it('should throw UnauthorizedException for invalid refresh token', async () => {
      mockPrismaService.refreshToken.findUnique.mockResolvedValue(null);

      await expect(service.refreshTokens('invalid-token')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException for expired refresh token', async () => {
      const expiredToken = {
        id: 'token-id',
        userId: 'user-123',
        token: 'expired-token',
        expiresAt: new Date(Date.now() - 86400000), // 1 day ago
      };

      mockPrismaService.refreshToken.findUnique.mockResolvedValue(expiredToken);

      await expect(service.refreshTokens('expired-token')).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('logout', () => {
    it('should delete all refresh tokens for user', async () => {
      mockPrismaService.refreshToken.deleteMany.mockResolvedValue({ count: 2 });

      await service.logout('user-123');

      expect(prismaService.refreshToken.deleteMany).toHaveBeenCalledWith({
        where: { userId: 'user-123' },
      });
    });
  });

  describe('authenticateWithInstagram', () => {
    it('should create new user on first login', async () => {
      mockInstagramService.exchangeCodeForToken.mockResolvedValue({
        accessToken: 'ig-token',
        userId: 'ig-12345',
      });

      mockInstagramService.getUserProfile.mockResolvedValue({
        id: 'ig-12345',
        username: 'newuser',
        name: 'New User',
        profile_picture_url: 'https://example.com/pic.jpg',
      });

      mockPrismaService.user.findUnique.mockResolvedValue(null);

      const newUser = {
        id: 'user-new',
        instagramId: 'ig-12345',
        instagramUsername: 'newuser',
        name: 'New User',
        profilePicture: 'https://example.com/pic.jpg',
        bio: null,
        defaultIntentions: [],
        createdAt: new Date(),
      };

      mockPrismaService.user.create.mockResolvedValue(newUser);
      mockJwtService.sign
        .mockReturnValueOnce('access-token')
        .mockReturnValueOnce('refresh-token');
      mockPrismaService.refreshToken.create.mockResolvedValue({
        token: 'refresh-token',
      });

      const result = await service.authenticateWithInstagram(
        'auth-code',
        'https://redirect.uri',
      );

      expect(result.isNewUser).toBe(true);
      expect(result.user.instagramUsername).toBe('newuser');
      expect(result.accessToken).toBe('access-token');
    });

    it('should login existing user', async () => {
      mockInstagramService.exchangeCodeForToken.mockResolvedValue({
        accessToken: 'ig-token',
        userId: 'ig-12345',
      });

      mockInstagramService.getUserProfile.mockResolvedValue({
        id: 'ig-12345',
        username: 'existinguser',
        name: 'Existing User',
        profile_picture_url: 'https://example.com/pic.jpg',
      });

      const existingUser = {
        id: 'user-existing',
        instagramId: 'ig-12345',
        instagramUsername: 'existinguser',
        name: 'Existing User',
        profilePicture: 'https://example.com/pic.jpg',
        bio: 'Hello!',
        defaultIntentions: ['fire', 'handshake'],
        deletedAt: null,
        createdAt: new Date(),
      };

      mockPrismaService.user.findUnique.mockResolvedValue(existingUser);
      mockJwtService.sign
        .mockReturnValueOnce('access-token')
        .mockReturnValueOnce('refresh-token');
      mockPrismaService.refreshToken.create.mockResolvedValue({
        token: 'refresh-token',
      });

      const result = await service.authenticateWithInstagram(
        'auth-code',
        'https://redirect.uri',
      );

      expect(result.isNewUser).toBe(false);
      expect(result.user.instagramUsername).toBe('existinguser');
    });
  });
});
