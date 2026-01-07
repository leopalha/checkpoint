import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PremiumService } from './premium.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import {
  PremiumStatusDto,
  PremiumPlansResponseDto,
  CreditsPackagesResponseDto,
  SubscribePremiumDto,
  PurchaseCreditsDto,
  PurchaseResponseDto,
} from './dto/premium.dto';

@ApiTags('premium')
@Controller('premium')
export class PremiumController {
  constructor(private readonly premiumService: PremiumService) {}

  @Get('status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user premium status' })
  @ApiResponse({
    status: 200,
    description: 'Premium status',
    type: PremiumStatusDto,
  })
  async getStatus(@CurrentUser('userId') userId: string): Promise<PremiumStatusDto> {
    return this.premiumService.getStatus(userId);
  }

  @Get('plans')
  @ApiOperation({ summary: 'Get available premium plans' })
  @ApiResponse({
    status: 200,
    description: 'List of premium plans',
    type: PremiumPlansResponseDto,
  })
  async getPlans(): Promise<PremiumPlansResponseDto> {
    return this.premiumService.getPlans();
  }

  @Get('credits/packages')
  @ApiOperation({ summary: 'Get available credits packages' })
  @ApiResponse({
    status: 200,
    description: 'List of credits packages',
    type: CreditsPackagesResponseDto,
  })
  async getCreditsPackages(): Promise<CreditsPackagesResponseDto> {
    return this.premiumService.getCreditsPackages();
  }

  @Post('subscribe')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Subscribe to premium plan' })
  @ApiResponse({
    status: 201,
    description: 'Subscription successful',
  })
  async subscribe(
    @CurrentUser('userId') userId: string,
    @Body() dto: SubscribePremiumDto,
  ) {
    return this.premiumService.subscribePremium(userId, dto.planId, dto.paymentIntentId);
  }

  @Post('credits/purchase')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Purchase extra credits/likes' })
  @ApiResponse({
    status: 201,
    description: 'Purchase successful',
    type: PurchaseResponseDto,
  })
  async purchaseCredits(
    @CurrentUser('userId') userId: string,
    @Body() dto: PurchaseCreditsDto,
  ): Promise<PurchaseResponseDto> {
    return this.premiumService.purchaseCredits(userId, dto.amount, dto.paymentIntentId);
  }
}
