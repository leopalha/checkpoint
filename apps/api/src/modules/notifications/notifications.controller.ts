import {
  Controller,
  Post,
  Delete,
  Body,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { IsString, IsIn } from 'class-validator';

import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

class RegisterDeviceDto {
  @IsString()
  token!: string;

  @IsIn(['ios', 'android'])
  platform!: 'ios' | 'android';
}

class UnregisterDeviceDto {
  @IsString()
  token!: string;
}

@ApiTags('Notifications')
@Controller('notifications')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  @Post('device')
  @ApiOperation({ summary: 'Register device for push notifications' })
  @ApiResponse({ status: 200, description: 'Device registered' })
  async registerDevice(
    @CurrentUser('userId') userId: string,
    @Body() dto: RegisterDeviceDto,
  ) {
    return this.notificationsService.registerDeviceToken(userId, dto.token, dto.platform);
  }

  @Delete('device')
  @ApiOperation({ summary: 'Unregister device from push notifications' })
  @ApiResponse({ status: 200, description: 'Device unregistered' })
  async unregisterDevice(
    @CurrentUser('userId') userId: string,
    @Body() dto: UnregisterDeviceDto,
  ) {
    return this.notificationsService.unregisterDeviceToken(userId, dto.token);
  }
}
