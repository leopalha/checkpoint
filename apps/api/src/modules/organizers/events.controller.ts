import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

import { OrganizerEventsService } from './events.service';
import { OrganizerGuard } from './guards/organizer.guard';
import { CurrentOrganizer } from './decorators/current-organizer.decorator';
import { CreateEventDto, UpdateEventDto } from './dto/event.dto';

@ApiTags('Organizer Events')
@Controller('organizers/events')
@UseGuards(OrganizerGuard)
@ApiBearerAuth()
export class OrganizerEventsController {
  constructor(private eventsService: OrganizerEventsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new event' })
  @ApiResponse({ status: 201, description: 'Event created' })
  @ApiResponse({ status: 400, description: 'Invalid dates' })
  async createEvent(
    @CurrentOrganizer('organizerId') organizerId: string,
    @Body() dto: CreateEventDto,
  ) {
    return this.eventsService.createEvent(organizerId, dto);
  }

  @Get(':eventId')
  @ApiOperation({ summary: 'Get event by ID' })
  @ApiResponse({ status: 200, description: 'Event details' })
  @ApiResponse({ status: 404, description: 'Event not found' })
  async getEventById(
    @CurrentOrganizer('organizerId') organizerId: string,
    @Param('eventId') eventId: string,
  ) {
    return this.eventsService.getEventById(organizerId, eventId);
  }

  @Patch(':eventId')
  @ApiOperation({ summary: 'Update an event' })
  @ApiResponse({ status: 200, description: 'Event updated' })
  @ApiResponse({ status: 404, description: 'Event not found' })
  async updateEvent(
    @CurrentOrganizer('organizerId') organizerId: string,
    @Param('eventId') eventId: string,
    @Body() dto: UpdateEventDto,
  ) {
    return this.eventsService.updateEvent(organizerId, eventId, dto);
  }

  @Delete(':eventId')
  @ApiOperation({ summary: 'Delete an event' })
  @ApiResponse({ status: 200, description: 'Event deleted' })
  @ApiResponse({ status: 400, description: 'Cannot delete event with check-ins' })
  @ApiResponse({ status: 404, description: 'Event not found' })
  async deleteEvent(
    @CurrentOrganizer('organizerId') organizerId: string,
    @Param('eventId') eventId: string,
  ) {
    await this.eventsService.deleteEvent(organizerId, eventId);
    return { success: true };
  }

  @Post(':eventId/regenerate-qr')
  @ApiOperation({ summary: 'Regenerate QR code for event' })
  @ApiResponse({ status: 200, description: 'New QR code' })
  @ApiResponse({ status: 404, description: 'Event not found' })
  async regenerateQRCode(
    @CurrentOrganizer('organizerId') organizerId: string,
    @Param('eventId') eventId: string,
  ) {
    return this.eventsService.regenerateQRCode(organizerId, eventId);
  }

  @Get(':eventId/attendees')
  @ApiOperation({ summary: 'Get event attendees' })
  @ApiResponse({ status: 200, description: 'List of attendees' })
  @ApiResponse({ status: 404, description: 'Event not found' })
  async getAttendees(
    @CurrentOrganizer('organizerId') organizerId: string,
    @Param('eventId') eventId: string,
  ) {
    return this.eventsService.getEventAttendees(organizerId, eventId);
  }
}
