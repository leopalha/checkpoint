import { ApiProperty } from '@nestjs/swagger';

export class ThemeResponseDto {
  @ApiProperty({ example: 'romantic' })
  id!: string;

  @ApiProperty({ example: 'Romance' })
  name!: string;

  @ApiProperty({ example: 'Para encontros românticos e dates' })
  description!: string;

  @ApiProperty({ example: '#FF6B6B' })
  primaryColor!: string;

  @ApiProperty({ example: '#FF85A1' })
  secondaryColor!: string;

  @ApiProperty({ example: '💕' })
  emoji!: string;

  @ApiProperty({ example: ['fire', 'highfive', 'champagne'] })
  defaultInteractions!: string[];

  @ApiProperty({ example: 'É Match! 💕' })
  matchMessage!: string;
}

export class ThemeListResponseDto {
  @ApiProperty({ type: [ThemeResponseDto] })
  themes!: ThemeResponseDto[];
}
