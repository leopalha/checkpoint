import { IsString, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

type InteractionType = 'fire' | 'handshake' | 'highfive' | 'carona' | 'ticket' | 'champagne' | 'briefcase' | 'target';

export class SendInteractionDto {
  @ApiProperty({ description: 'Target user ID' })
  @IsString()
  toUserId!: string;

  @ApiProperty({ description: 'Event ID where interaction happens' })
  @IsString()
  eventId!: string;

  @ApiProperty({
    description: 'Interaction type',
    enum: ['fire', 'handshake', 'highfive', 'carona', 'ticket', 'champagne', 'briefcase', 'target'],
  })
  @IsString()
  @IsIn(['fire', 'handshake', 'highfive', 'carona', 'ticket', 'champagne', 'briefcase', 'target'])
  type!: InteractionType;
}

export class InteractionResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  fromUserId!: string;

  @ApiProperty()
  toUserId!: string;

  @ApiProperty()
  eventId!: string;

  @ApiProperty()
  type!: string;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty({ description: 'Whether this created a match' })
  matchCreated!: boolean;

  @ApiProperty({ description: 'Match ID if created', required: false })
  matchId?: string;
}

export class UserAtEventDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  instagramUsername!: string;

  @ApiProperty({ required: false })
  profilePicture?: string | null;

  @ApiProperty({ required: false })
  bio?: string | null;

  @ApiProperty({ type: [String] })
  intentions!: string[];

  @ApiProperty({ description: 'Whether current user already interacted' })
  alreadyInteracted!: boolean;

  @ApiProperty({ description: 'Interaction type if already sent', required: false })
  interactionType?: string;
}
