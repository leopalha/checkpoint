import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, Min } from 'class-validator';

export class PremiumStatusDto {
  @ApiProperty({ example: true })
  isPremium!: boolean;

  @ApiProperty({ example: 10 })
  dailyLikesRemaining!: number;

  @ApiProperty({ example: 10 })
  dailyLikesTotal!: number;

  @ApiProperty({ example: '2026-01-08T00:00:00Z' })
  dailyLikesResetAt!: Date;

  @ApiProperty({ example: 0 })
  creditsBalance!: number;

  @ApiProperty({ example: null, nullable: true })
  premiumExpiresAt!: Date | null;
}

export class PremiumPlanDto {
  @ApiProperty({ example: 'monthly' })
  id!: string;

  @ApiProperty({ example: 'Mensal' })
  name!: string;

  @ApiProperty({ example: 'Acesso ilimitado por 1 mês' })
  description!: string;

  @ApiProperty({ example: 29.90 })
  price!: number;

  @ApiProperty({ example: 'BRL' })
  currency!: string;

  @ApiProperty({ example: 30 })
  durationDays!: number;

  @ApiProperty({ example: ['Curtidas ilimitadas', 'Ver quem curtiu', 'Modo fantasma'] })
  features!: string[];
}

export class PremiumPlansResponseDto {
  @ApiProperty({ type: [PremiumPlanDto] })
  plans!: PremiumPlanDto[];
}

export class SubscribePremiumDto {
  @ApiProperty({ example: 'monthly' })
  @IsString()
  planId!: string;

  @ApiProperty({ example: 'stripe_payment_intent_xxx', required: false })
  @IsOptional()
  @IsString()
  paymentIntentId?: string;
}

export class PurchaseCreditsDto {
  @ApiProperty({ example: 10, minimum: 1 })
  @IsNumber()
  @Min(1)
  amount!: number;

  @ApiProperty({ example: 'stripe_payment_intent_xxx', required: false })
  @IsOptional()
  @IsString()
  paymentIntentId?: string;
}

export class CreditsPackageDto {
  @ApiProperty({ example: '10_credits' })
  id!: string;

  @ApiProperty({ example: 10 })
  credits!: number;

  @ApiProperty({ example: 9.90 })
  price!: number;

  @ApiProperty({ example: 'BRL' })
  currency!: string;

  @ApiProperty({ example: false })
  isBestValue!: boolean;
}

export class CreditsPackagesResponseDto {
  @ApiProperty({ type: [CreditsPackageDto] })
  packages!: CreditsPackageDto[];
}

export class PurchaseResponseDto {
  @ApiProperty({ example: true })
  success!: boolean;

  @ApiProperty({ example: 'Créditos adicionados com sucesso' })
  message!: string;

  @ApiProperty({ example: 20 })
  newBalance!: number;
}
