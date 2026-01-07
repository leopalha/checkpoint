import { IsString, IsNotEmpty, MaxLength, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendMessageDto {
  @ApiProperty({ description: 'Match ID to send message to' })
  @IsString()
  @IsNotEmpty()
  matchId!: string;

  @ApiProperty({ description: 'Message content', maxLength: 1000 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  content!: string;
}

export class GetMessagesQueryDto {
  @ApiProperty({ required: false, description: 'Cursor for pagination (message ID)' })
  @IsOptional()
  @IsString()
  cursor?: string;

  @ApiProperty({ required: false, description: 'Number of messages to fetch', default: 50 })
  @IsOptional()
  limit?: number;
}

export class MarkReadDto {
  @ApiProperty({ description: 'ID of the last message read' })
  @IsString()
  @IsNotEmpty()
  lastMessageId!: string;
}

// Response interfaces (not classes, since they're not used for validation)
export interface MessageResponseDto {
  id: string;
  matchId: string;
  senderId: string;
  content: string;
  isOwn: boolean;
  readAt: string | null;
  createdAt: string;
}

export interface ConversationResponseDto {
  matchId: string;
  otherUser: {
    id: string;
    name: string;
    instagramUsername: string;
    profilePicture: string | null;
  };
  event: {
    id: string;
    name: string;
  };
  interactionType: string;
  lastMessage: {
    content: string;
    createdAt: string;
    isOwn: boolean;
  } | null;
  unreadCount: number;
  expiresAt: string | null;
}
