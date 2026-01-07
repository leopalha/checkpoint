import {
  IsString,
  IsOptional,
  IsNumber,
  IsArray,
  IsDateString,
  Min,
  Max,
  IsIn,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateEventDto {
  @ApiProperty({ description: 'Event name' })
  @IsString()
  @MaxLength(100)
  name!: string;

  @ApiPropertyOptional({ description: 'Event description' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiPropertyOptional({ description: 'Event image URL' })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiProperty({ description: 'Event start date/time' })
  @IsDateString()
  startDate!: string;

  @ApiProperty({ description: 'Event end date/time' })
  @IsDateString()
  endDate!: string;

  @ApiProperty({ description: 'Location name' })
  @IsString()
  @MaxLength(100)
  locationName!: string;

  @ApiProperty({ description: 'Full address' })
  @IsString()
  @MaxLength(200)
  locationAddress!: string;

  @ApiProperty({ description: 'Latitude' })
  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude!: number;

  @ApiProperty({ description: 'Longitude' })
  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude!: number;

  @ApiPropertyOptional({ description: 'Theme ID', default: 'social' })
  @IsOptional()
  @IsString()
  themeId?: string;

  @ApiPropertyOptional({
    description: 'Allowed interaction types',
    default: ['fire', 'handshake', 'highfive'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  allowedInteractions?: string[];

  @ApiPropertyOptional({ description: 'GPS radius in meters', default: 500 })
  @IsOptional()
  @IsNumber()
  @Min(200)
  @Max(5000)
  gpsRadius?: number;
}

export class UpdateEventDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  allowedInteractions?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(200)
  @Max(5000)
  gpsRadius?: number;
}

export class NearbyEventsQueryDto {
  @ApiProperty({ description: 'User latitude' })
  @IsNumber()
  @Type(() => Number)
  latitude!: number;

  @ApiProperty({ description: 'User longitude' })
  @IsNumber()
  @Type(() => Number)
  longitude!: number;

  @ApiPropertyOptional({ description: 'Search radius in km', default: 50 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  @Max(100)
  radius?: number;

  @ApiPropertyOptional({ description: 'Filter by theme' })
  @IsOptional()
  @IsString()
  themeId?: string;
}

export class EventListQueryDto {
  @ApiPropertyOptional({ description: 'Page number', default: 1 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ description: 'Items per page', default: 20 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  @Max(100)
  limit?: number;

  @ApiPropertyOptional({ description: 'Filter: upcoming, past, all' })
  @IsOptional()
  @IsIn(['upcoming', 'past', 'all'])
  filter?: 'upcoming' | 'past' | 'all';
}

export class SearchEventsQueryDto {
  @ApiProperty({ description: 'Search query' })
  @IsString()
  @MaxLength(100)
  q!: string;

  @ApiPropertyOptional({ description: 'Page number', default: 1 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ description: 'Items per page', default: 20 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  @Max(100)
  limit?: number;

  @ApiPropertyOptional({ description: 'Filter by theme' })
  @IsOptional()
  @IsString()
  themeId?: string;

  @ApiPropertyOptional({ description: 'Filter: upcoming, past, all' })
  @IsOptional()
  @IsIn(['upcoming', 'past', 'all'])
  filter?: 'upcoming' | 'past' | 'all';

  @ApiPropertyOptional({ description: 'User latitude for distance calculation' })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  latitude?: number;

  @ApiPropertyOptional({ description: 'User longitude for distance calculation' })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  longitude?: number;
}

export class EventResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiPropertyOptional()
  description?: string | null;

  @ApiPropertyOptional()
  imageUrl?: string | null;

  @ApiProperty()
  startDate!: Date;

  @ApiProperty()
  endDate!: Date;

  @ApiProperty()
  locationName!: string;

  @ApiProperty()
  locationAddress!: string;

  @ApiProperty()
  latitude!: number;

  @ApiProperty()
  longitude!: number;

  @ApiProperty()
  themeId!: string;

  @ApiProperty({ type: [String] })
  allowedInteractions!: string[];

  @ApiProperty()
  gpsRadius!: number;

  @ApiPropertyOptional({ description: 'Distance from user in km' })
  distance?: number;

  @ApiPropertyOptional({ description: 'Number of confirmed attendees' })
  attendeeCount?: number;

  @ApiPropertyOptional({ description: 'User presence status at this event' })
  userPresence?: {
    confirmed: boolean;
    checkedIn: boolean;
    intentions: string[];
  } | null;
}
