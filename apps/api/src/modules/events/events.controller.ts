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

import { EventsService } from './events.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import {
  NearbyEventsQueryDto,
  EventListQueryDto,
  SearchEventsQueryDto,
  EventResponseDto,
} from './dto/event.dto';

@ApiTags('Events')
@Controller('events')
export class EventsController {
  constructor(private eventsService: EventsService) {}

  @Get()
  @ApiOperation({ summary: 'List upcoming events' })
  @ApiResponse({ status: 200, description: 'List of events' })
  async listEvents(@Query() query: EventListQueryDto) {
    return this.eventsService.findUpcoming(query);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search events by name, location, or description' })
  @ApiResponse({ status: 200, description: 'List of matching events' })
  async searchEvents(@Query() query: SearchEventsQueryDto) {
    return this.eventsService.search(query);
  }

  @Get('nearby')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Find events near user location' })
  @ApiResponse({ status: 200, description: 'List of nearby events' })
  async findNearby(
    @Query() query: NearbyEventsQueryDto,
    @CurrentUser('userId') userId: string,
  ): Promise<EventResponseDto[]> {
    return this.eventsService.findNearby(query, userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get event by ID' })
  @ApiResponse({ status: 200, description: 'Event details' })
  @ApiResponse({ status: 404, description: 'Event not found' })
  async getEvent(@Param('id') id: string): Promise<EventResponseDto> {
    return this.eventsService.findById(id);
  }

  @Get(':id/details')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get event details with user presence info' })
  @ApiResponse({ status: 200, description: 'Event details with presence' })
  async getEventWithPresence(
    @Param('id') id: string,
    @CurrentUser('userId') userId: string,
  ): Promise<EventResponseDto> {
    return this.eventsService.findById(id, userId);
  }
}
