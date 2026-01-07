import {
  IsString,
  IsArray,
  IsNumber,
  IsOptional,
  Min,
  Max,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ConfirmPresenceDto {
  @ApiProperty({ description: 'Event ID' })
  @IsString()
  eventId!: string;

  @ApiProperty({ description: 'User intentions for this event', type: [String] })
  @IsArray()
  @IsString({ each: true })
  intentions!: string[];

  @ApiPropertyOptional({ description: 'Optional status message' })
  @IsOptional()
  @IsString()
  status?: string;
}

export class CheckInDto {
  @ApiProperty({ description: 'Event ID' })
  @IsString()
  eventId!: string;

  @ApiProperty({ description: 'User latitude' })
  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude!: number;

  @ApiProperty({ description: 'User longitude' })
  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude!: number;
}

export class QrCheckInDto {
  @ApiProperty({ description: 'QR code content (event ID or encrypted data)' })
  @IsString()
  qrCode!: string;

  @ApiProperty({ description: 'User latitude' })
  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude!: number;

  @ApiProperty({ description: 'User longitude' })
  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude!: number;
}

export class UpdateIntentionsDto {
  @ApiProperty({ description: 'Updated intentions', type: [String] })
  @IsArray()
  @IsString({ each: true })
  intentions!: string[];
}

export class PresenceResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  userId!: string;

  @ApiProperty()
  eventId!: string;

  @ApiProperty({ type: [String] })
  intentions!: string[];

  @ApiPropertyOptional()
  status?: string | null;

  @ApiProperty()
  confirmedAt!: Date;

  @ApiPropertyOptional()
  checkedInAt?: Date | null;

  @ApiPropertyOptional()
  checkedOutAt?: Date | null;

  @ApiPropertyOptional({ description: 'Event details' })
  event?: {
    id: string;
    name: string;
    startDate: Date;
    endDate: Date;
    locationName: string;
    imageUrl: string | null;
  };
}

export class CheckInResultDto {
  @ApiProperty()
  success!: boolean;

  @ApiProperty()
  presence!: PresenceResponseDto;

  @ApiPropertyOptional({ description: 'Number of other checked-in users at event' })
  activeUsers?: number;
}
