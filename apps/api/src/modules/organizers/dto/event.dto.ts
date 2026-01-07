import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsArray,
  IsDateString,
  Min,
  Max,
  ArrayMinSize,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEventDto {
  @ApiProperty({ description: 'Event name' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ description: 'Event description', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Event image URL', required: false })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiProperty({ description: 'Start date (ISO 8601)' })
  @IsDateString()
  @IsNotEmpty()
  startDate!: string;

  @ApiProperty({ description: 'End date (ISO 8601)' })
  @IsDateString()
  @IsNotEmpty()
  endDate!: string;

  @ApiProperty({ description: 'Location name' })
  @IsString()
  @IsNotEmpty()
  locationName!: string;

  @ApiProperty({ description: 'Full address' })
  @IsString()
  @IsNotEmpty()
  locationAddress!: string;

  @ApiProperty({ description: 'Latitude' })
  @IsNumber()
  latitude!: number;

  @ApiProperty({ description: 'Longitude' })
  @IsNumber()
  longitude!: number;

  @ApiProperty({ description: 'Theme ID', default: 'social' })
  @IsOptional()
  @IsString()
  themeId?: string;

  @ApiProperty({
    description: 'Allowed interaction types',
    default: ['fire', 'handshake', 'highfive'],
  })
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  allowedInteractions?: string[];

  @ApiProperty({ description: 'GPS radius in meters (min 200)', default: 500 })
  @IsOptional()
  @IsNumber()
  @Min(200)
  @Max(5000)
  gpsRadius?: number;
}

export class UpdateEventDto {
  @ApiProperty({ description: 'Event name', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ description: 'Event description', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Event image URL', required: false })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiProperty({ description: 'Start date (ISO 8601)', required: false })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiProperty({ description: 'End date (ISO 8601)', required: false })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiProperty({ description: 'Location name', required: false })
  @IsOptional()
  @IsString()
  locationName?: string;

  @ApiProperty({ description: 'Full address', required: false })
  @IsOptional()
  @IsString()
  locationAddress?: string;

  @ApiProperty({ description: 'Latitude', required: false })
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @ApiProperty({ description: 'Longitude', required: false })
  @IsOptional()
  @IsNumber()
  longitude?: number;

  @ApiProperty({ description: 'Theme ID', required: false })
  @IsOptional()
  @IsString()
  themeId?: string;

  @ApiProperty({ description: 'Allowed interaction types', required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  allowedInteractions?: string[];

  @ApiProperty({ description: 'GPS radius in meters', required: false })
  @IsOptional()
  @IsNumber()
  @Min(200)
  @Max(5000)
  gpsRadius?: number;
}

export interface EventResponseDto {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  startDate: string;
  endDate: string;
  locationName: string;
  locationAddress: string;
  latitude: number;
  longitude: number;
  themeId: string;
  allowedInteractions: string[];
  gpsRadius: number;
  qrCode: string | null;
  stats?: {
    presences: number;
    interactions: number;
    matches: number;
  };
  createdAt: string;
}
