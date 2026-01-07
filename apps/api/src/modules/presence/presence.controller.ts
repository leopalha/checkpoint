import {
  Controller,
  Get,
  Post,
  Patch,
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

import { PresenceService } from './presence.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import {
  ConfirmPresenceDto,
  CheckInDto,
  QrCheckInDto,
  UpdateIntentionsDto,
  PresenceResponseDto,
  CheckInResultDto,
} from './dto/presence.dto';

@ApiTags('Presence')
@Controller('presence')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PresenceController {
  constructor(private presenceService: PresenceService) {}

  @Post('confirm')
  @ApiOperation({ summary: 'Confirm presence at an event' })
  @ApiResponse({ status: 201, description: 'Presence confirmed' })
  @ApiResponse({ status: 400, description: 'Invalid intentions or past event' })
  @ApiResponse({ status: 409, description: 'Already confirmed' })
  async confirmPresence(
    @CurrentUser('userId') userId: string,
    @Body() dto: ConfirmPresenceDto,
  ): Promise<PresenceResponseDto> {
    return this.presenceService.confirmPresence(userId, dto);
  }

  @Post('check-in')
  @Throttle({ default: { limit: 5, ttl: 60000 } }) // 5 check-in attempts per minute
  @ApiOperation({ summary: 'Check in at an event using GPS' })
  @ApiResponse({ status: 200, description: 'Checked in successfully' })
  @ApiResponse({ status: 400, description: 'Too far from event location' })
  @ApiResponse({ status: 404, description: 'Presence not confirmed' })
  async checkIn(
    @CurrentUser('userId') userId: string,
    @Body() dto: CheckInDto,
  ): Promise<CheckInResultDto> {
    return this.presenceService.checkIn(userId, dto);
  }

  @Post('check-in/qr')
  @Throttle({ default: { limit: 5, ttl: 60000 } }) // 5 QR check-in attempts per minute
  @ApiOperation({ summary: 'Check in at an event using QR code' })
  @ApiResponse({ status: 200, description: 'Checked in successfully' })
  @ApiResponse({ status: 400, description: 'Invalid QR code or too far' })
  async checkInWithQr(
    @CurrentUser('userId') userId: string,
    @Body() dto: QrCheckInDto,
  ): Promise<CheckInResultDto> {
    return this.presenceService.checkInWithQr(userId, dto);
  }

  @Post(':eventId/check-out')
  @ApiOperation({ summary: 'Check out from an event' })
  @ApiResponse({ status: 200, description: 'Checked out successfully' })
  async checkOut(
    @CurrentUser('userId') userId: string,
    @Param('eventId') eventId: string,
  ): Promise<PresenceResponseDto> {
    return this.presenceService.checkOut(userId, eventId);
  }

  @Patch(':eventId/intentions')
  @ApiOperation({ summary: 'Update intentions for an event' })
  @ApiResponse({ status: 200, description: 'Intentions updated' })
  async updateIntentions(
    @CurrentUser('userId') userId: string,
    @Param('eventId') eventId: string,
    @Body() dto: UpdateIntentionsDto,
  ): Promise<PresenceResponseDto> {
    return this.presenceService.updateIntentions(userId, eventId, dto);
  }

  @Delete(':eventId')
  @ApiOperation({ summary: 'Cancel presence at an event' })
  @ApiResponse({ status: 200, description: 'Presence cancelled' })
  @ApiResponse({ status: 400, description: 'Cannot cancel after check-in' })
  async cancelPresence(
    @CurrentUser('userId') userId: string,
    @Param('eventId') eventId: string,
  ): Promise<{ message: string }> {
    await this.presenceService.cancelPresence(userId, eventId);
    return { message: 'Presence cancelled successfully' };
  }

  @Get('my')
  @ApiOperation({ summary: 'Get user presences' })
  @ApiResponse({ status: 200, description: 'List of presences' })
  async getMyPresences(
    @CurrentUser('userId') userId: string,
    @Query('filter') filter?: 'upcoming' | 'past' | 'active',
  ): Promise<PresenceResponseDto[]> {
    return this.presenceService.getUserPresences(userId, filter);
  }

  @Get('active')
  @ApiOperation({ summary: 'Get currently active presence (checked in)' })
  @ApiResponse({ status: 200, description: 'Active presences' })
  async getActivePresence(
    @CurrentUser('userId') userId: string,
  ): Promise<PresenceResponseDto[]> {
    return this.presenceService.getUserPresences(userId, 'active');
  }
}
