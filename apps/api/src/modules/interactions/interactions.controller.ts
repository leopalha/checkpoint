import {
  Controller,
  Get,
  Post,
  Delete,
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

import { InteractionsService } from './interactions.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import {
  SendInteractionDto,
  InteractionResponseDto,
  UserAtEventDto,
} from './dto/interaction.dto';

@ApiTags('Interactions')
@Controller('interactions')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class InteractionsController {
  constructor(private interactionsService: InteractionsService) {}

  @Post()
  @Throttle({ default: { limit: 30, ttl: 60000 } }) // 30 interactions per minute max
  @ApiOperation({ summary: 'Send an interaction to another user' })
  @ApiResponse({ status: 201, description: 'Interaction sent' })
  @ApiResponse({ status: 400, description: 'Invalid interaction or already sent' })
  @ApiResponse({ status: 403, description: 'Daily limit reached or not checked in' })
  async sendInteraction(
    @CurrentUser('userId') userId: string,
    @Body() dto: SendInteractionDto,
  ): Promise<InteractionResponseDto> {
    return this.interactionsService.sendInteraction(userId, dto);
  }

  @Get('event/:eventId/users')
  @ApiOperation({ summary: 'Get users checked in at an event' })
  @ApiResponse({ status: 200, description: 'List of users at event' })
  async getUsersAtEvent(
    @CurrentUser('userId') userId: string,
    @Param('eventId') eventId: string,
  ): Promise<UserAtEventDto[]> {
    return this.interactionsService.getUsersAtEvent(userId, eventId);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get interaction statistics' })
  @ApiResponse({ status: 200, description: 'Interaction stats' })
  async getStats(
    @CurrentUser('userId') userId: string,
    @Query('eventId') eventId?: string,
  ) {
    return this.interactionsService.getMyInteractions(userId, eventId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Undo an interaction (within 5 minutes)' })
  @ApiResponse({ status: 200, description: 'Interaction undone' })
  @ApiResponse({ status: 400, description: 'Cannot undo after 5 minutes' })
  async undoInteraction(
    @CurrentUser('userId') userId: string,
    @Param('id') id: string,
  ): Promise<{ message: string }> {
    await this.interactionsService.undoInteraction(userId, id);
    return { message: 'Interaction undone successfully' };
  }
}
