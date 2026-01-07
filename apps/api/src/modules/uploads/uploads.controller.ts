import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  BadRequestException,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiConsumes, ApiBody, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';

import { UploadsService } from './uploads.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { OrganizerGuard } from '../organizers/guards/organizer.guard';

@ApiTags('Uploads')
@Controller('uploads')
export class UploadsController {
  constructor(private uploadsService: UploadsService) {}

  /**
   * Upload a profile picture (for users)
   */
  @Post('profile-picture')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async uploadProfilePicture(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const result = await this.uploadsService.processProfilePicture(file);

    return {
      success: true,
      url: result.url,
      filename: result.filename,
    };
  }

  /**
   * Upload an event image (for organizers)
   */
  @Post('event-image')
  @ApiBearerAuth()
  @UseGuards(OrganizerGuard)
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async uploadEventImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const result = await this.uploadsService.processEventImage(file);

    return {
      success: true,
      url: result.url,
      filename: result.filename,
    };
  }

  /**
   * Upload a general image (authenticated users or organizers)
   */
  @Post('image')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiQuery({ name: 'type', required: false, enum: ['profile', 'event', 'general'] })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Query('type') type?: 'profile' | 'event' | 'general',
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    let result;
    switch (type) {
      case 'profile':
        result = await this.uploadsService.processProfilePicture(file);
        break;
      case 'event':
        result = await this.uploadsService.processEventImage(file);
        break;
      default:
        result = await this.uploadsService.processImage(file);
    }

    return {
      success: true,
      url: result.url,
      filename: result.filename,
    };
  }
}
