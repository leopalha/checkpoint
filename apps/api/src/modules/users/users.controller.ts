import {
  Controller,
  Get,
  Patch,
  Delete,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

import { UsersService } from './users.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

class UpdateProfileDto {
  bio?: string;
  defaultIntentions?: string[];
}

@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'User profile' })
  async getMe(@Request() req: { user: { userId: string } }) {
    return this.usersService.findById(req.user.userId);
  }

  @Patch('me')
  @ApiOperation({ summary: 'Update current user profile' })
  @ApiResponse({ status: 200, description: 'Profile updated' })
  async updateMe(
    @Request() req: { user: { userId: string } },
    @Body() dto: UpdateProfileDto,
  ) {
    return this.usersService.updateProfile(req.user.userId, dto);
  }

  @Get('me/export')
  @ApiOperation({ summary: 'Export all user data (LGPD)' })
  @ApiResponse({ status: 200, description: 'User data export' })
  async exportData(@Request() req: { user: { userId: string } }) {
    return this.usersService.exportUserData(req.user.userId);
  }

  @Delete('me')
  @ApiOperation({ summary: 'Schedule account deletion (LGPD)' })
  @ApiResponse({ status: 200, description: 'Deletion scheduled' })
  async deleteMe(@Request() req: { user: { userId: string } }) {
    await this.usersService.scheduleDeletion(req.user.userId);
    return {
      message: 'Account deletion scheduled in 30 days',
      canCancelUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    };
  }

  @Post('me/cancel-deletion')
  @ApiOperation({ summary: 'Cancel scheduled deletion' })
  @ApiResponse({ status: 200, description: 'Deletion cancelled' })
  async cancelDeletion(@Request() req: { user: { userId: string } }) {
    await this.usersService.cancelDeletion(req.user.userId);
    return { message: 'Deletion cancelled' };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get public user profile by ID' })
  @ApiResponse({ status: 200, description: 'User profile' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getUserById(
    @Param('id') id: string,
    @CurrentUser('userId') currentUserId: string,
  ) {
    return this.usersService.getPublicProfile(id, currentUserId);
  }
}
