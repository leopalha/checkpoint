import { IsString, IsOptional, IsArray, MaxLength, IsIn } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { InteractionType } from '@checkpoint/types';

export class UpdateProfileDto {
  @ApiPropertyOptional({ description: 'User bio', maxLength: 150 })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  bio?: string;

  @ApiPropertyOptional({ description: 'Display name', maxLength: 50 })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  name?: string;

  @ApiPropertyOptional({
    description: 'Default intentions for events',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @IsIn(
    [
      'fire',
      'handshake',
      'highfive',
      'carona',
      'ticket',
      'champagne',
      'briefcase',
      'target',
    ],
    { each: true },
  )
  defaultIntentions?: InteractionType[];
}

export class UserProfileResponse {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  instagramUsername!: string;

  @ApiPropertyOptional()
  profilePicture?: string | null;

  @ApiPropertyOptional()
  bio?: string | null;

  @ApiProperty({ type: [String] })
  defaultIntentions!: string[];

  @ApiProperty()
  createdAt!: Date;
}

export class ExportDataResponse {
  @ApiProperty()
  user!: UserProfileResponse;

  @ApiProperty({ description: 'User presences at events' })
  presences!: unknown[];

  @ApiProperty({ description: 'User interactions' })
  interactions!: unknown[];

  @ApiProperty({ description: 'User matches' })
  matches!: unknown[];

  @ApiProperty()
  exportedAt!: Date;
}
