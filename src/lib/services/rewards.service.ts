import { prisma } from '@/lib/prisma';
import { TransactionType } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

export const REWARD_TIERS = [
  { name: 'BRONZE', min: 0 },
  { name: 'SILVER', min: 1000 },
  { name: 'GOLD', min: 5000 },
  { name: 'PLATINUM', min: 10000 },
];

export function getTier(lifetimePoints: number) {
  return REWARD_TIERS.slice().reverse().find(t => lifetimePoints >= t.min) || REWARD_TIERS[0];
}

export function getNextTier(lifetimePoints: number) {
  return REWARD_TIERS.find(t => t.min > lifetimePoints);
}

export const rewardService = {
  async getConfig() {
    let config = await prisma.rewardConfig.findFirst();
    if (!config) {
      config = await prisma.rewardConfig.create({ data: {} });
    }
    return config;
  },

  async getOrCreate(userId: string, referredByCode?: string) {
    let account = await prisma.rewardAccount.findUnique({
      where: { userId },
      include: { transactions: { orderBy: { createdAt: 'desc' } } },
    });

    if (!account) {
      const config = await this.getConfig();
      let referredById = null;

      if (referredByCode) {
        const referrer = await prisma.rewardAccount.findUnique({ where: { referralCode: referredByCode } });
        if (referrer) referredById = referrer.id;
      }

      account = await prisma.rewardAccount.create({
        data: {
          userId,
          referralCode: uuidv4().substring(0, 8).toUpperCase(),
          referredById,
        },
        include: { transactions: { orderBy: { createdAt: 'desc' } } },
      });

      // Grant Signup Bonus
      await this.addPoints(account.id, config.signupBonus, TransactionType.EARNED, 'Signup Bonus');

      const updatedAccount = await prisma.rewardAccount.findUniqueOrThrow({
        where: { id: account.id },
        include: { transactions: { orderBy: { createdAt: 'desc' } } },
      });
      return updatedAccount;
    }
    return account;
  },

  async addPoints(rewardAccountId: string, points: number, type: TransactionType, description: string, orderId?: string) {
    if (points === 0) return null;
    const account = await prisma.rewardAccount.findUnique({ where: { id: rewardAccountId } });
    if (!account) throw new Error('Account not found');

    const newCurrent = Math.max(0, account.currentPoints + points);
    const newLifetime = points > 0 ? account.lifetimePoints + points : account.lifetimePoints;
    const newTier = getTier(newLifetime).name;

    const [updatedAccount, transaction] = await prisma.$transaction([
      prisma.rewardAccount.update({
        where: { id: rewardAccountId },
        data: { currentPoints: newCurrent, lifetimePoints: newLifetime, tier: newTier },
      }),
      prisma.rewardTransaction.create({
        data: { rewardAccountId, type, points, description, orderId },
      }),
    ]);

    return { updatedAccount, transaction };
  },

  calculateRedemptionLimit(currentPoints: number, subtotal: number, config: any) {
    // Max 20% discount
    const maxDiscountAllowed = subtotal * 0.2;
    // Max 500 points redeemed
    const maxPointsAllowedByConfig = 500;
    
    let usablePoints = Math.min(currentPoints, maxPointsAllowedByConfig);
    const maxPointsForDiscount = maxDiscountAllowed / config.redemptionRatio;
    
    usablePoints = Math.floor(Math.min(usablePoints, maxPointsForDiscount));
    
    return {
      usablePoints,
      discount: usablePoints * config.redemptionRatio,
    };
  },

  async awardOrderPoints(orderId: string) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { user: { include: { rewardAccount: true } } },
    });

    if (!order || order.status !== 'DELIVERED') return;
    if (!order.user.rewardAccount) return;

    // Check if points already awarded for this order
    const existingTx = await prisma.rewardTransaction.findFirst({
      where: { orderId: order.id, type: TransactionType.EARNED },
    });
    if (existingTx) return;

    const config = await this.getConfig();
    const account = order.user.rewardAccount;
    
    // Earn points from order subtotal
    const pointsToEarn = Math.floor(order.subtotal * config.earningRatio);
    if (pointsToEarn > 0) {
      await this.addPoints(account.id, pointsToEarn, TransactionType.EARNED, `Earned from Order #${order.orderNumber}`, order.id);
    }

    // First Order Bonus & Referral Logic
    if (account.lifetimeOrders === 0) {
      if (config.firstOrderBonus > 0) {
        await this.addPoints(account.id, config.firstOrderBonus, TransactionType.EARNED, 'First Order Bonus', order.id);
      }

      // Referrer gets points
      if (account.referredById && config.referralBonus > 0) {
        await this.addPoints(account.referredById, config.referralBonus, TransactionType.EARNED, `Referral Bonus for ${order.user.firstName || order.user.email}`);
      }
    }

    // Update lifetime orders
    await prisma.rewardAccount.update({
      where: { id: account.id },
      data: { lifetimeOrders: { increment: 1 } },
    });
  },

  async redeemPoints(userId: string, pointsToRedeem: number, subtotal: number) {
    const config = await this.getConfig();
    const account = await prisma.rewardAccount.findUnique({ where: { userId } });
    if (!account) throw new Error('Reward account not found');

    const limit = this.calculateRedemptionLimit(account.currentPoints, subtotal, config);
    if (pointsToRedeem > limit.usablePoints) {
      throw new Error(`Cannot redeem ${pointsToRedeem} points. Maximum allowed for this order is ${limit.usablePoints}.`);
    }
    if (pointsToRedeem <= 0) throw new Error('Invalid points amount');

    const code = 'RWD-' + uuidv4().substring(0, 8).toUpperCase();
    const discountAmount = pointsToRedeem * config.redemptionRatio;

    await prisma.$transaction([
      prisma.rewardAccount.update({
        where: { id: account.id },
        data: { currentPoints: account.currentPoints - pointsToRedeem },
      }),
      prisma.rewardTransaction.create({
        data: {
          rewardAccountId: account.id,
          type: TransactionType.REDEEMED,
          points: -pointsToRedeem,
          description: `Redeemed ${pointsToRedeem} points for ₹${discountAmount} discount (Code: ${code})`,
        },
      }),
    ]);

    return { code, discountAmount };
  }
};
