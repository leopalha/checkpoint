import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Query,
  Body,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';

import { RematchService } from './rematch.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import {
  CreateRematchRequestDto,
  RematchRequestResponseDto,
  RematchRequestsResponseDto,
  AvailableForRematchResponseDto,
  RematchConnectionsResponseDto,
  RematchStatsDto,
} from './dto/rematch.dto';

@ApiTags('ReMatch')
@Controller('rematches')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class RematchController {
  constructor(private rematchService: RematchService) {}

  @Get('requests')
  @ApiOperation({ summary: 'Get rematch requests (pending and sent)' })
  @ApiResponse({ status: 200, type: RematchRequestsResponseDto })
  async getRequests(
    @CurrentUser('userId') userId: string,
  ): Promise<RematchRequestsResponseDto> {
    return this.rematchService.getRequests(userId);
  }

  @Get('available')
  @ApiOperation({ summary: 'Get users available for rematch from recent events' })
  @ApiResponse({ status: 200, type: AvailableForRematchResponseDto })
  async getAvailable(
    @CurrentUser('userId') userId: string,
  ): Promise<AvailableForRematchResponseDto> {
    return this.rematchService.getAvailable(userId);
  }

  @Get('connections')
  @ApiOperation({ summary: 'Get connections made through rematch' })
  @ApiResponse({ status: 200, type: RematchConnectionsResponseDto })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'per_page', required: false, type: Number })
  async getConnections(
    @CurrentUser('userId') userId: string,
    @Query('page') page?: string,
    @Query('per_page') perPage?: string,
  ): Promise<RematchConnectionsResponseDto> {
    return this.rematchService.getConnections(
      userId,
      page ? parseInt(page, 10) : 1,
      perPage ? parseInt(perPage, 10) : 20,
    );
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get rematch statistics' })
  @ApiResponse({ status: 200, type: RematchStatsDto })
  async getStats(
    @CurrentUser('userId') userId: string,
  ): Promise<RematchStatsDto> {
    return this.rematchService.getStats(userId);
  }

  @Post()
  @ApiOperation({ summary: 'Send a rematch request' })
  @ApiResponse({ status: 201, type: RematchRequestResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid request or limit reached' })
  @ApiResponse({ status: 403, description: 'User is blocked' })
  async sendRequest(
    @CurrentUser('userId') userId: string,
    @Body() dto: CreateRematchRequestDto,
  ): Promise<RematchRequestResponseDto> {
    return this.rematchService.sendRequest(userId, dto);
  }

  @Post(':id/accept')
  @ApiOperation({ summary: 'Accept a rematch request' })
  @ApiResponse({ status: 200, type: RematchRequestResponseDto })
  @ApiResponse({ status: 404, description: 'Request not found' })
  @ApiResponse({ status: 400, description: 'Request already processed or expired' })
  async acceptRequest(
    @CurrentUser('userId') userId: string,
    @Param('id') requestId: string,
  ): Promise<RematchRequestResponseDto> {
    return this.rematchService.acceptRequest(userId, requestId);
  }

  @Patch(':id/ignore')
  @ApiOperation({ summary: 'Ignore a rematch request' })
  @ApiResponse({ status: 200, type: RematchRequestResponseDto })
  @ApiResponse({ status: 404, description: 'Request not found' })
  async ignoreRequest(
    @CurrentUser('userId') userId: string,
    @Param('id') requestId: string,
  ): Promise<RematchRequestResponseDto> {
    return this.rematchService.ignoreRequest(userId, requestId);
  }

  @Post('block/:userId')
  @ApiOperation({ summary: 'Block a user from sending rematch requests' })
  @ApiResponse({ status: 200, description: 'User blocked' })
  async blockUser(
    @CurrentUser('userId') userId: string,
    @Param('userId') blockedId: string,
  ): Promise<{ message: string }> {
    await this.rematchService.blockUser(userId, blockedId);
    return { message: 'User blocked successfully' };
  }

  @Delete('block/:userId')
  @ApiOperation({ summary: 'Unblock a user' })
  @ApiResponse({ status: 200, description: 'User unblocked' })
  async unblockUser(
    @CurrentUser('userId') userId: string,
    @Param('userId') blockedId: string,
  ): Promise<{ message: string }> {
    await this.rematchService.unblockUser(userId, blockedId);
    return { message: 'User unblocked successfully' };
  }

  @Get('blocked')
  @ApiOperation({ summary: 'Get list of blocked users' })
  @ApiResponse({ status: 200, type: [String] })
  async getBlockedUsers(
    @CurrentUser('userId') userId: string,
  ): Promise<string[]> {
    return this.rematchService.getBlockedUsers(userId);
  }
}
