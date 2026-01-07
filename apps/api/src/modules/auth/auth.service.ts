import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { PrismaService } from '../../prisma/prisma.service';
import { InstagramService } from './instagram.service';

interface JwtPayload {
  sub: string;
  username: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse extends TokenPair {
  user: {
    id: string;
    name: string;
    instagramUsername: string;
    profilePicture: string | null;
    bio: string | null;
    defaultIntentions: string[];
  };
  isNewUser: boolean;
}

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private instagramService: InstagramService,
  ) {}

  async authenticateWithInstagram(
    code: string,
    redirectUri: string,
  ): Promise<AuthResponse> {
    // Exchange code for Instagram access token
    const { accessToken: igToken, userId: igUserId } =
      await this.instagramService.exchangeCodeForToken(code, redirectUri);

    // Get user profile from Instagram
    const igProfile = await this.instagramService.getUserProfile(igToken);

    // Find or create user in our database
    return this.loginWithInstagram(
      igUserId,
      igProfile.username,
      igProfile.name || igProfile.username,
      igProfile.profile_picture_url,
    );
  }

  async loginWithInstagram(
    instagramId: string,
    instagramUsername: string,
    name: string,
    profilePicture?: string,
  ): Promise<AuthResponse> {
    // Find or create user
    let user = await this.prisma.user.findUnique({
      where: { instagramId },
    });

    const isNewUser = !user;

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          instagramId,
          instagramUsername,
          name,
          profilePicture,
        },
      });
    } else {
      // Update profile picture if changed
      if (profilePicture && profilePicture !== user.profilePicture) {
        user = await this.prisma.user.update({
          where: { id: user.id },
          data: { profilePicture },
        });
      }
    }

    // Generate tokens
    const tokens = await this.generateTokens(user.id, user.instagramUsername);

    return {
      ...tokens,
      user: {
        id: user.id,
        name: user.name,
        instagramUsername: user.instagramUsername,
        profilePicture: user.profilePicture,
        bio: user.bio,
        defaultIntentions: user.defaultIntentions,
      },
      isNewUser,
    };
  }

  async refreshTokens(refreshToken: string): Promise<TokenPair> {
    const storedToken = await this.prisma.refreshToken.findUnique({
      where: { token: refreshToken },
    });

    if (!storedToken || storedToken.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // Delete old token
    await this.prisma.refreshToken.delete({
      where: { id: storedToken.id },
    });

    // Generate new tokens
    const user = await this.prisma.user.findUnique({
      where: { id: storedToken.userId },
    });

    if (!user || user.deletedAt) {
      throw new UnauthorizedException('User not found');
    }

    return this.generateTokens(user.id, user.instagramUsername);
  }

  async logout(userId: string): Promise<void> {
    await this.prisma.refreshToken.deleteMany({
      where: { userId },
    });
  }

  async validateUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || user.deletedAt) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }

  private async generateTokens(
    userId: string,
    username: string,
  ): Promise<TokenPair> {
    const payload: JwtPayload = { sub: userId, username };

    const accessToken = this.jwtService.sign(payload);

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN', '7d'),
    });

    // Store refresh token
    await this.prisma.refreshToken.create({
      data: {
        userId,
        token: refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });

    return { accessToken, refreshToken };
  }
}
