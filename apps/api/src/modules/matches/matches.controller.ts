import {
  Controller,
  Get,
  Post,
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

import { MatchesService } from './matches.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { MatchResponseDto, RevealMatchResponseDto } from './dto/match.dto';

@ApiTags('Matches')
@Controller('matches')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class MatchesController {
  constructor(private matchesService: MatchesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all my matches' })
  @ApiResponse({ status: 200, description: 'List of matches' })
  async getMyMatches(
    @CurrentUser('userId') userId: string,
    @Query('status') status?: 'pending' | 'revealed' | 'expired',
  ): Promise<MatchResponseDto[]> {
    return this.matchesService.getMyMatches(userId, status);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get match statistics' })
  @ApiResponse({ status: 200, description: 'Match stats' })
  async getStats(@CurrentUser('userId') userId: string) {
    return this.matchesService.getMatchStats(userId);
  }

  @Get('event/:eventId')
  @ApiOperation({ summary: 'Get pending matches for an event' })
  @ApiResponse({ status: 200, description: 'Pending matches info' })
  async getPendingForEvent(
    @CurrentUser('userId') userId: string,
    @Param('eventId') eventId: string,
  ) {
    return this.matchesService.getPendingMatchesForEvent(userId, eventId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get match by ID' })
  @ApiResponse({ status: 200, description: 'Match details' })
  @ApiResponse({ status: 404, description: 'Match not found' })
  async getMatch(
    @CurrentUser('userId') userId: string,
    @Param('id') id: string,
  ): Promise<MatchResponseDto> {
    return this.matchesService.getMatchById(userId, id);
  }

  @Post(':id/reveal')
  @ApiOperation({ summary: 'Reveal a match (requires both users checked in)' })
  @ApiResponse({ status: 200, description: 'Match revealed' })
  @ApiResponse({ status: 400, description: 'Both users must be checked in' })
  async revealMatch(
    @CurrentUser('userId') userId: string,
    @Param('id') id: string,
  ): Promise<RevealMatchResponseDto> {
    return this.matchesService.revealMatch(userId, id);
  }
}
