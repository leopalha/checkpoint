import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

interface InstagramTokenResponse {
  access_token: string;
  user_id: number;
}

interface InstagramUserResponse {
  id: string;
  username: string;
  name?: string;
  profile_picture_url?: string;
}

@Injectable()
export class InstagramService {
  private readonly clientId: string;
  private readonly clientSecret: string;

  constructor(private configService: ConfigService) {
    this.clientId = this.configService.get<string>('INSTAGRAM_CLIENT_ID', '');
    this.clientSecret = this.configService.get<string>(
      'INSTAGRAM_CLIENT_SECRET',
      '',
    );
  }

  async exchangeCodeForToken(
    code: string,
    redirectUri: string,
  ): Promise<{ accessToken: string; userId: string }> {
    try {
      // Exchange code for short-lived access token
      const tokenResponse = await axios.post<InstagramTokenResponse>(
        'https://api.instagram.com/oauth/access_token',
        new URLSearchParams({
          client_id: this.clientId,
          client_secret: this.clientSecret,
          grant_type: 'authorization_code',
          redirect_uri: redirectUri,
          code,
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );

      return {
        accessToken: tokenResponse.data.access_token,
        userId: tokenResponse.data.user_id.toString(),
      };
    } catch (error) {
      console.error('Instagram token exchange failed:', error);
      throw new UnauthorizedException('Failed to authenticate with Instagram');
    }
  }

  async getUserProfile(accessToken: string): Promise<InstagramUserResponse> {
    try {
      const response = await axios.get<InstagramUserResponse>(
        'https://graph.instagram.com/me',
        {
          params: {
            fields: 'id,username,name,profile_picture_url',
            access_token: accessToken,
          },
        },
      );

      return response.data;
    } catch (error) {
      console.error('Instagram profile fetch failed:', error);
      throw new UnauthorizedException('Failed to fetch Instagram profile');
    }
  }

  getAuthorizationUrl(redirectUri: string, state: string): string {
    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: redirectUri,
      scope: 'user_profile',
      response_type: 'code',
      state,
    });

    return `https://api.instagram.com/oauth/authorize?${params.toString()}`;
  }
}
