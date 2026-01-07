import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, MaxLength, IsEnum } from 'class-validator';

export class CreateRematchRequestDto {
  @ApiProperty({ description: 'User ID to send rematch request to' })
  @IsString()
  toUserId!: string;

  @ApiProperty({ description: 'Event ID where you both attended' })
  @IsString()
  eventId!: string;

  @ApiPropertyOptional({ description: 'Optional message with the request' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  message?: string;
}

export class UpdateRematchStatusDto {
  @ApiProperty({ enum: ['accepted', 'ignored'], description: 'New status' })
  @IsEnum(['accepted', 'ignored'])
  status!: 'accepted' | 'ignored';
}

export class RematchUserDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  instagramUsername!: string;

  @ApiPropertyOptional()
  profilePicture?: string | null;

  @ApiPropertyOptional()
  bio?: string | null;
}

export class RematchEventDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  locationName!: string;

  @ApiProperty()
  startDate!: Date;

  @ApiProperty()
  endDate!: Date;
}

export class RematchRequestResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  fromUserId!: string;

  @ApiProperty()
  toUserId!: string;

  @ApiProperty()
  eventId!: string;

  @ApiPropertyOptional()
  message?: string | null;

  @ApiProperty({ enum: ['pending', 'accepted', 'ignored', 'expired'] })
  status!: string;

  @ApiProperty()
  createdAt!: Date;

  @ApiPropertyOptional()
  respondedAt?: Date | null;

  @ApiProperty()
  expiresAt!: Date;

  @ApiProperty({ type: RematchUserDto })
  otherUser!: RematchUserDto;

  @ApiProperty({ type: RematchEventDto })
  event!: RematchEventDto;
}

export class RematchRequestsResponseDto {
  @ApiProperty({ type: [RematchRequestResponseDto] })
  pending!: RematchRequestResponseDto[];

  @ApiProperty({ type: [RematchRequestResponseDto] })
  sent!: RematchRequestResponseDto[];
}

export class AvailableForRematchUserDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  instagramUsername!: string;

  @ApiPropertyOptional()
  profilePicture?: string | null;

  @ApiPropertyOptional()
  bio?: string | null;

  @ApiProperty({ description: 'Whether a request was already sent' })
  requestSent!: boolean;
}

export class AvailableForRematchEventDto {
  @ApiProperty()
  event!: RematchEventDto;

  @ApiProperty({ type: [AvailableForRematchUserDto] })
  users!: AvailableForRematchUserDto[];
}

export class AvailableForRematchResponseDto {
  @ApiProperty({ type: [AvailableForRematchEventDto] })
  events!: AvailableForRematchEventDto[];

  @ApiProperty({ description: 'Daily limit for rematch requests' })
  dailyLimit!: number;

  @ApiProperty({ description: 'Remaining requests today' })
  remainingToday!: number;
}

export class RematchConnectionDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({ type: RematchUserDto })
  user!: RematchUserDto;

  @ApiProperty({ type: RematchEventDto })
  event!: RematchEventDto;

  @ApiProperty()
  connectedAt!: Date;

  @ApiPropertyOptional()
  matchId?: string;
}

export class RematchConnectionsResponseDto {
  @ApiProperty({ type: [RematchConnectionDto] })
  connections!: RematchConnectionDto[];

  @ApiProperty()
  total!: number;
}

export class RematchStatsDto {
  @ApiProperty()
  requestsSent!: number;

  @ApiProperty()
  requestsReceived!: number;

  @ApiProperty()
  connectionsFromRematch!: number;

  @ApiProperty()
  remainingToday!: number;

  @ApiProperty()
  dailyLimit!: number;
}
