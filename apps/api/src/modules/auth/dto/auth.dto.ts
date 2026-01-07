import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class InstagramLoginDto {
  @ApiProperty({ description: 'Instagram OAuth authorization code' })
  @IsString()
  @IsNotEmpty()
  code!: string;

  @ApiProperty({ description: 'Redirect URI used in OAuth flow' })
  @IsString()
  @IsNotEmpty()
  redirectUri!: string;
}

export class InstagramCallbackDto {
  @ApiProperty({ description: 'Instagram access token' })
  @IsString()
  @IsNotEmpty()
  accessToken!: string;

  @ApiProperty({ description: 'Instagram user ID' })
  @IsString()
  @IsNotEmpty()
  userId!: string;
}

export class RefreshTokenDto {
  @ApiProperty({ description: 'Refresh token' })
  @IsString()
  @IsNotEmpty()
  refreshToken!: string;
}

export class CreateProfileDto {
  @ApiProperty({ description: 'User bio', required: false })
  @IsString()
  @IsOptional()
  bio?: string;

  @ApiProperty({ description: 'Default intentions', type: [String] })
  @IsString({ each: true })
  defaultIntentions!: string[];
}

export class AuthResponseDto {
  @ApiProperty()
  accessToken!: string;

  @ApiProperty()
  refreshToken!: string;

  @ApiProperty()
  user!: {
    id: string;
    name: string;
    instagramUsername: string;
    profilePicture: string | null;
    bio: string | null;
    isNewUser: boolean;
  };
}
