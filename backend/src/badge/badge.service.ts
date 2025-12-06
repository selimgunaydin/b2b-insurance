import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BadgeType, Prisma, TransactionType } from '@prisma/client';
import { NotificationService } from '../notification/notification.service';

interface BadgeCriteria {
  threshold: number;
  insuranceType?: string;
  [key: string]: unknown; // Add index signature for Prisma JSON compatibility
}

@Injectable()
export class BadgeService {
  private readonly logger = new Logger(BadgeService.name);

  constructor(
    private prisma: PrismaService,
    private notificationService: NotificationService,
  ) { }

  // Get all badges
  async getAllBadges() {
    return this.prisma.badge.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'asc' },
    });
  }

  // Get badges for a specific tali
  async getTaliBadges(userId: string) {
    const taliProfile = await this.prisma.taliProfile.findUnique({
      where: { userId },
      include: {
        badges: {
          include: { badge: true },
          orderBy: { earnedAt: 'desc' },
        },
      },
    });

    if (!taliProfile) {
      return [];
    }

    return taliProfile.badges;
  }

  // Create a new badge (admin only)
  async createBadge(data: {
    name: string;
    description: string;
    iconUrl?: string;
    type: BadgeType;
    criteria: BadgeCriteria;
    points?: number;
  }) {
    return this.prisma.badge.create({
      data: {
        name: data.name,
        description: data.description,
        iconUrl: data.iconUrl,
        type: data.type,
        criteria: data.criteria as Prisma.InputJsonValue,
        points: data.points || 0,
      },
    });
  }

  // Update a badge
  async updateBadge(
    id: string,
    data: Partial<{
      name: string;
      description: string;
      iconUrl: string;
      type: BadgeType;
      criteria: BadgeCriteria;
      points: number;
      isActive: boolean;
    }>,
  ) {
    // Build update object without criteria first
    const { criteria, ...rest } = data;
    const updateData: Prisma.BadgeUpdateInput = { ...rest };

    // Add criteria with proper type casting if provided
    if (criteria) {
      updateData.criteria = criteria as unknown as Prisma.InputJsonValue;
    }

    return this.prisma.badge.update({
      where: { id },
      data: updateData,
    });
  }

  // Delete a badge
  async deleteBadge(id: string) {
    // First delete all tali badges
    await this.prisma.taliBadge.deleteMany({
      where: { badgeId: id },
    });

    return this.prisma.badge.delete({
      where: { id },
    });
  }

  // Award a badge to a tali
  async awardBadge(taliId: string, badgeId: string) {
    const taliProfile = await this.prisma.taliProfile.findUnique({
      where: { id: taliId },
    });

    if (!taliProfile) {
      throw new Error('Tali profile not found');
    }

    // Check if already has the badge
    const existing = await this.prisma.taliBadge.findUnique({
      where: {
        taliId_badgeId: { taliId, badgeId },
      },
    });

    if (existing) {
      return existing;
    }

    // Get badge details
    const badge = await this.prisma.badge.findUnique({
      where: { id: badgeId },
    });

    if (!badge) {
      throw new Error('Badge not found');
    }

    // Award the badge
    const taliBadge = await this.prisma.taliBadge.create({
      data: {
        taliId,
        badgeId,
      },
      include: { badge: true },
    });

    // Award bonus points if any
    if (badge.points > 0) {
      await this.prisma.taliProfile.update({
        where: { id: taliId },
        data: {
          points: {
            increment: badge.points,
          },
        },
      });

      // Create transaction record for badge reward
      await this.prisma.transactions.create({
        data: {
          userId: taliProfile.userId,
          points: badge.points,
          type: TransactionType.BADGE_REWARD,
          status: 'SUCCESS',
          description: `Rozet: ${badge.name}`,
        },
      });
    }

    // Send notification
    await this.notificationService.createSystemNotification(
      taliProfile.userId,
      'Yeni Rozet Kazandınız! 🏆',
      `Tebrikler! "${badge.name}" rozetini kazandınız.${badge.points > 0 ? ` +${badge.points} puan eklendi.` : ''}`,
    );

    this.logger.log(`Badge "${badge.name}" awarded to tali ${taliId}`);

    return taliBadge;
  }

  // Check and award badges based on tali's achievements
  async checkAndAwardBadges(taliId: string) {
    const taliProfile = await this.prisma.taliProfile.findUnique({
      where: { id: taliId },
      include: {
        badges: true,
        insuranceRequests: {
          where: { status: 'COMPLETED' },
          include: { policy: true },
        },
        customers: true,
      },
    });

    if (!taliProfile) {
      return [];
    }

    const earnedBadgeIds = taliProfile.badges.map((b) => b.badgeId);
    const allBadges = await this.prisma.badge.findMany({
      where: {
        isActive: true,
        id: { notIn: earnedBadgeIds },
      },
    });

    const awardedBadges = [];

    for (const badge of allBadges) {
      const criteria = badge.criteria as unknown as BadgeCriteria;
      let qualified = false;

      switch (badge.type) {
        case 'POLICY_COUNT':
          const policyCount = criteria.insuranceType
            ? taliProfile.insuranceRequests.filter(
              (r) => r.type === criteria.insuranceType,
            ).length
            : taliProfile.insuranceRequests.length;
          qualified = policyCount >= criteria.threshold;
          break;

        case 'PREMIUM_TOTAL':
          const totalPremium = taliProfile.insuranceRequests.reduce(
            (sum, r) => sum + (r.policy ? Number(r.policy.premium) : 0),
            0,
          );
          qualified = totalPremium >= criteria.threshold;
          break;

        case 'CUSTOMER_COUNT':
          qualified = taliProfile.customers.length >= criteria.threshold;
          break;

        // STREAK and SPECIAL badges are awarded manually
        default:
          break;
      }

      if (qualified) {
        const awarded = await this.awardBadge(taliId, badge.id);
        awardedBadges.push(awarded);
      }
    }

    return awardedBadges;
  }

  // Get leaderboard - sorted by TOTAL EARNED points, not current balance
  // Also masks names for non-current users
  async getLeaderboard(limit: number = 10, currentUserId?: string) {
    // First, get total earned points for each user from transactions
    const earnedPointsPerUser = await this.prisma.transactions.groupBy({
      by: ['userId'],
      _sum: { points: true },
      where: {
        status: 'SUCCESS',
        points: { gt: 0 }, // Only positive points (earned)
      },
    });

    // Create a map of userId -> totalEarnedPoints
    const earnedPointsMap = new Map<string, number>();
    for (const entry of earnedPointsPerUser) {
      earnedPointsMap.set(entry.userId, Number(entry._sum.points) || 0);
    }

    const talis = await this.prisma.taliProfile.findMany({
      include: {
        user: {
          select: { id: true, email: true },
        },
        badges: {
          include: { badge: true },
        },
        _count: {
          select: {
            insuranceRequests: true,
            customers: true,
          },
        },
      },
    });

    // Sort by total earned points
    const sortedTalis = talis
      .map((tali) => ({
        ...tali,
        totalEarnedPoints: earnedPointsMap.get(tali.user.id) || 0,
      }))
      .sort((a, b) => b.totalEarnedPoints - a.totalEarnedPoints)
      .slice(0, limit);

    // Helper to mask name: "Selim Günaydin" -> "Se***"
    const maskName = (name: string): string => {
      if (!name || name.length < 2) return '***';
      return name.substring(0, 2) + '***';
    };

    return sortedTalis.map((tali, index) => {
      const isCurrentUser = tali.user.id === currentUserId;

      return {
        rank: index + 1,
        id: tali.id,
        fullName: isCurrentUser ? tali.fullName : maskName(tali.fullName),
        email: isCurrentUser ? tali.user.email : '***@***.com',
        points: tali.totalEarnedPoints, // Show total earned, not current balance
        currentPoints: Number(tali.points), // Also include current balance
        badgeCount: tali.badges.length,
        badges: tali.badges.map((tb) => ({
          id: tb.badge.id,
          name: tb.badge.name,
          iconUrl: tb.badge.iconUrl,
        })),
        policyCount: tali._count.insuranceRequests,
        customerCount: tali._count.customers,
        membershipType: tali.membershipType,
        isCurrentUser,
      };
    });
  }

  // Initialize default badges
  async initializeDefaultBadges() {
    const defaultBadges = [
      {
        name: 'İlk Adım',
        description: 'İlk poliçenizi oluşturdunuz',
        type: BadgeType.POLICY_COUNT,
        criteria: { threshold: 1 },
        points: 10,
      },
      {
        name: 'Yıldız Satıcı',
        description: '10 poliçe oluşturdunuz',
        type: BadgeType.POLICY_COUNT,
        criteria: { threshold: 10 },
        points: 50,
      },
      {
        name: 'Süper Satıcı',
        description: '50 poliçe oluşturdunuz',
        type: BadgeType.POLICY_COUNT,
        criteria: { threshold: 50 },
        points: 200,
      },
      {
        name: 'Efsane Satıcı',
        description: '100 poliçe oluşturdunuz',
        type: BadgeType.POLICY_COUNT,
        criteria: { threshold: 100 },
        points: 500,
      },
      {
        name: 'Müşteri Avcısı',
        description: '10 müşteri kazandınız',
        type: BadgeType.CUSTOMER_COUNT,
        criteria: { threshold: 10 },
        points: 30,
      },
      {
        name: 'Müşteri Ustası',
        description: '50 müşteri kazandınız',
        type: BadgeType.CUSTOMER_COUNT,
        criteria: { threshold: 50 },
        points: 150,
      },
      {
        name: 'Trafik Uzmanı',
        description: '10 trafik sigortası oluşturdunuz',
        type: BadgeType.POLICY_COUNT,
        criteria: { threshold: 10, insuranceType: 'TRAFIK' },
        points: 40,
      },
      {
        name: 'Kasko Uzmanı',
        description: '10 kasko sigortası oluşturdunuz',
        type: BadgeType.POLICY_COUNT,
        criteria: { threshold: 10, insuranceType: 'KASKO' },
        points: 40,
      },
      {
        name: 'DASK Uzmanı',
        description: '10 DASK sigortası oluşturdunuz',
        type: BadgeType.POLICY_COUNT,
        criteria: { threshold: 10, insuranceType: 'DASK' },
        points: 40,
      },
      {
        name: 'Prim Avcısı',
        description: '100.000 TL prim topladınız',
        type: BadgeType.PREMIUM_TOTAL,
        criteria: { threshold: 100000 },
        points: 100,
      },
      {
        name: 'Prim Ustası',
        description: '500.000 TL prim topladınız',
        type: BadgeType.PREMIUM_TOTAL,
        criteria: { threshold: 500000 },
        points: 300,
      },
    ];

    for (const badge of defaultBadges) {
      const existing = await this.prisma.badge.findFirst({
        where: { name: badge.name },
      });

      if (!existing) {
        await this.prisma.badge.create({ data: badge });
        this.logger.log(`Created badge: ${badge.name}`);
      }
    }
  }
}
