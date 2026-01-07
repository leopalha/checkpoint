import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

const FREE_DAILY_LIKES = 10;
const PREMIUM_DAILY_LIKES = 999; // Essentially unlimited

const PREMIUM_PLANS = [
  {
    id: 'weekly',
    name: 'Semanal',
    description: 'Acesso ilimitado por 7 dias',
    price: 14.90,
    currency: 'BRL',
    durationDays: 7,
    features: [
      'Curtidas ilimitadas',
      'Ver quem curtiu você',
      'Modo fantasma',
      'Destaque nos eventos',
    ],
  },
  {
    id: 'monthly',
    name: 'Mensal',
    description: 'Acesso ilimitado por 30 dias',
    price: 29.90,
    currency: 'BRL',
    durationDays: 30,
    features: [
      'Curtidas ilimitadas',
      'Ver quem curtiu você',
      'Modo fantasma',
      'Destaque nos eventos',
      'Suporte prioritário',
    ],
  },
  {
    id: 'quarterly',
    name: 'Trimestral',
    description: 'Acesso ilimitado por 90 dias - Melhor custo-benefício!',
    price: 69.90,
    currency: 'BRL',
    durationDays: 90,
    features: [
      'Curtidas ilimitadas',
      'Ver quem curtiu você',
      'Modo fantasma',
      'Destaque nos eventos',
      'Suporte prioritário',
      'Acesso antecipado a novidades',
    ],
  },
];

const CREDIT_PACKAGES = [
  { id: '5_credits', credits: 5, price: 4.90, currency: 'BRL', isBestValue: false },
  { id: '10_credits', credits: 10, price: 9.90, currency: 'BRL', isBestValue: false },
  { id: '25_credits', credits: 25, price: 19.90, currency: 'BRL', isBestValue: true },
  { id: '50_credits', credits: 50, price: 34.90, currency: 'BRL', isBestValue: false },
];

@Injectable()
export class PremiumService {
  constructor(private prisma: PrismaService) {}

  async getStatus(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        isPremium: true,
        dailyLikesRemaining: true,
        dailyLikesResetAt: true,
      },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    // Check if daily likes need to be reset
    const now = new Date();
    const resetAt = new Date(user.dailyLikesResetAt);

    if (now >= resetAt) {
      // Reset daily likes
      const totalLikes = user.isPremium ? PREMIUM_DAILY_LIKES : FREE_DAILY_LIKES;
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);

      await this.prisma.user.update({
        where: { id: userId },
        data: {
          dailyLikesRemaining: totalLikes,
          dailyLikesResetAt: tomorrow,
        },
      });

      return {
        isPremium: user.isPremium,
        dailyLikesRemaining: totalLikes,
        dailyLikesTotal: totalLikes,
        dailyLikesResetAt: tomorrow,
        creditsBalance: 0, // Future: add credits table
        premiumExpiresAt: null, // Future: add premium expiry
      };
    }

    return {
      isPremium: user.isPremium,
      dailyLikesRemaining: user.dailyLikesRemaining,
      dailyLikesTotal: user.isPremium ? PREMIUM_DAILY_LIKES : FREE_DAILY_LIKES,
      dailyLikesResetAt: user.dailyLikesResetAt,
      creditsBalance: 0,
      premiumExpiresAt: null,
    };
  }

  getPlans() {
    return { plans: PREMIUM_PLANS };
  }

  getCreditsPackages() {
    return { packages: CREDIT_PACKAGES };
  }

  async subscribePremium(userId: string, planId: string, paymentIntentId?: string) {
    const plan = PREMIUM_PLANS.find(p => p.id === planId);
    if (!plan) {
      throw new BadRequestException('Invalid plan');
    }

    // TODO: Integrate with payment gateway (Stripe)
    // For now, we'll just activate premium

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + plan.durationDays);

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        isPremium: true,
        dailyLikesRemaining: PREMIUM_DAILY_LIKES,
      },
    });

    return {
      success: true,
      message: `Premium ${plan.name} ativado com sucesso!`,
      expiresAt,
    };
  }

  async purchaseCredits(userId: string, amount: number, paymentIntentId?: string) {
    const pkg = CREDIT_PACKAGES.find(p => p.credits === amount);
    if (!pkg) {
      throw new BadRequestException('Invalid credits package');
    }

    // TODO: Integrate with payment gateway (Stripe)
    // For now, we'll just add the likes

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { dailyLikesRemaining: true },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const newBalance = user.dailyLikesRemaining + amount;

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        dailyLikesRemaining: newBalance,
      },
    });

    return {
      success: true,
      message: `${amount} curtidas adicionadas com sucesso!`,
      newBalance,
    };
  }

  async consumeLike(userId: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { dailyLikesRemaining: true, isPremium: true },
    });

    if (!user) {
      return false;
    }

    // Premium users have unlimited likes
    if (user.isPremium) {
      return true;
    }

    if (user.dailyLikesRemaining <= 0) {
      return false;
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        dailyLikesRemaining: { decrement: 1 },
      },
    });

    return true;
  }

  async refundLike(userId: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        dailyLikesRemaining: { increment: 1 },
      },
    });
  }

  // Note: Daily likes are reset on-demand when user checks status
  // For a production system, consider using @nestjs/schedule with a cron job
}
