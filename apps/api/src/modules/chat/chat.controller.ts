import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';

import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import {
  SendMessageDto,
  MessageResponseDto,
  ConversationResponseDto,
  GetMessagesQueryDto,
  MarkReadDto,
} from './dto/chat.dto';

@ApiTags('Chat')
@Controller('chat')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Get('conversations')
  @ApiOperation({ summary: 'Get all conversations' })
  @ApiResponse({ status: 200, description: 'List of conversations' })
  async getConversations(
    @CurrentUser('userId') userId: string,
  ): Promise<ConversationResponseDto[]> {
    return this.chatService.getConversations(userId);
  }

  @Get('conversations/:matchId')
  @ApiOperation({ summary: 'Get conversation details' })
  @ApiResponse({ status: 200, description: 'Conversation details' })
  @ApiResponse({ status: 404, description: 'Conversation not found' })
  async getConversationDetails(
    @CurrentUser('userId') userId: string,
    @Param('matchId') matchId: string,
  ) {
    return this.chatService.getConversationDetails(userId, matchId);
  }

  @Get('messages/:matchId')
  @ApiOperation({ summary: 'Get messages for a conversation' })
  @ApiResponse({ status: 200, description: 'List of messages' })
  @ApiResponse({ status: 404, description: 'Conversation not found' })
  async getMessages(
    @CurrentUser('userId') userId: string,
    @Param('matchId') matchId: string,
    @Query() query: GetMessagesQueryDto,
  ): Promise<MessageResponseDto[]> {
    return this.chatService.getMessages(
      userId,
      matchId,
      query.cursor,
      query.limit ? Number(query.limit) : undefined,
    );
  }

  @Post('messages')
  @Throttle({ default: { limit: 60, ttl: 60000 } }) // 60 messages per minute max
  @ApiOperation({ summary: 'Send a message' })
  @ApiResponse({ status: 201, description: 'Message sent' })
  @ApiResponse({ status: 400, description: 'Chat expired or not revealed' })
  @ApiResponse({ status: 403, description: 'Not part of this conversation' })
  async sendMessage(
    @CurrentUser('userId') userId: string,
    @Body() dto: SendMessageDto,
  ): Promise<MessageResponseDto> {
    return this.chatService.sendMessage(userId, dto);
  }

  @Post('messages/:matchId/read')
  @ApiOperation({ summary: 'Mark messages as read' })
  @ApiResponse({ status: 200, description: 'Messages marked as read' })
  async markAsRead(
    @CurrentUser('userId') userId: string,
    @Param('matchId') matchId: string,
    @Body() dto: MarkReadDto,
  ): Promise<{ count: number }> {
    return this.chatService.markMessagesAsRead(userId, matchId, dto.lastMessageId);
  }

  @Get('unread')
  @ApiOperation({ summary: 'Get total unread message count' })
  @ApiResponse({ status: 200, description: 'Unread count' })
  async getUnreadCount(
    @CurrentUser('userId') userId: string,
  ): Promise<{ count: number }> {
    const count = await this.chatService.getUnreadCount(userId);
    return { count };
  }
}
