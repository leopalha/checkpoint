import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class MatchUserDto {
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

export class MatchResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  eventId!: string;

  @ApiProperty()
  interactionType!: string;

  @ApiProperty({ enum: ['pending', 'revealed', 'expired'] })
  status!: string;

  @ApiPropertyOptional()
  revealedAt?: Date | null;

  @ApiPropertyOptional()
  expiresAt?: Date | null;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty({ description: 'The other user in the match' })
  otherUser!: MatchUserDto;

  @ApiProperty({ description: 'Event info' })
  event!: {
    id: string;
    name: string;
    locationName: string;
  };

  @ApiProperty({ description: 'Whether chat is available' })
  canChat!: boolean;

  @ApiPropertyOptional({ description: 'Unread message count' })
  unreadCount?: number;
}

export class RevealMatchResponseDto {
  @ApiProperty()
  match!: MatchResponseDto;

  @ApiProperty({ description: 'Whether this is a new reveal or already revealed' })
  isNewReveal!: boolean;
}
