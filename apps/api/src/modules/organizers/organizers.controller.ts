import {
  Controller,
  Get,
  Post,
  Patch,
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

import { OrganizersService } from './organizers.service';
import { OrganizerGuard } from './guards/organizer.guard';
import { CurrentOrganizer } from './decorators/current-organizer.decorator';
import {
  RegisterOrganizerDto,
  LoginOrganizerDto,
  UpdateOrganizerDto,
  ChangePasswordDto,
} from './dto/organizer.dto';

@ApiTags('Organizers')
@Controller('organizers')
export class OrganizersController {
  constructor(private organizersService: OrganizersService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new organizer' })
  @ApiResponse({ status: 201, description: 'Organizer created' })
  @ApiResponse({ status: 409, description: 'Email already exists' })
  async register(@Body() dto: RegisterOrganizerDto) {
    return this.organizersService.register(dto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login as organizer' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() dto: LoginOrganizerDto) {
    return this.organizersService.login(dto);
  }

  @Get('me')
  @UseGuards(OrganizerGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current organizer profile' })
  @ApiResponse({ status: 200, description: 'Organizer profile' })
  async getProfile(@CurrentOrganizer('organizerId') organizerId: string) {
    return this.organizersService.getProfile(organizerId);
  }

  @Patch('me')
  @UseGuards(OrganizerGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update organizer profile' })
  @ApiResponse({ status: 200, description: 'Profile updated' })
  async updateProfile(
    @CurrentOrganizer('organizerId') organizerId: string,
    @Body() dto: UpdateOrganizerDto,
  ) {
    return this.organizersService.updateProfile(organizerId, dto);
  }

  @Post('me/change-password')
  @UseGuards(OrganizerGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Change password' })
  @ApiResponse({ status: 200, description: 'Password changed' })
  @ApiResponse({ status: 401, description: 'Current password incorrect' })
  async changePassword(
    @CurrentOrganizer('organizerId') organizerId: string,
    @Body() dto: ChangePasswordDto,
  ) {
    await this.organizersService.changePassword(organizerId, dto);
    return { success: true };
  }

  @Get('events')
  @UseGuards(OrganizerGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all my events' })
  @ApiResponse({ status: 200, description: 'List of events with stats' })
  async getMyEvents(@CurrentOrganizer('organizerId') organizerId: string) {
    return this.organizersService.getMyEvents(organizerId);
  }

  @Get('events/:eventId/stats')
  @UseGuards(OrganizerGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get event statistics' })
  @ApiResponse({ status: 200, description: 'Event stats' })
  @ApiResponse({ status: 404, description: 'Event not found' })
  async getEventStats(
    @CurrentOrganizer('organizerId') organizerId: string,
    @Param('eventId') eventId: string,
  ) {
    return this.organizersService.getEventStats(organizerId, eventId);
  }
}
