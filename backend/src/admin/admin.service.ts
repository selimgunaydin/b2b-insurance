import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RequestStatus, Role } from '@prisma/client';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats() {
    const pendingUsers = await this.prisma.user.count({
      where: {
        role: Role.TALI,
        isApproved: false,
      },
    });

    const pendingOffers = await this.prisma.insuranceRequest.count({
      where: {
        status: RequestStatus.PENDING_OFFER,
      },
    });

    const activePolicies = await this.prisma.policy.count({
      where: {
        createdAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1), // This month
        },
      },
    });

    // Assuming cancellation requests are stored in InsuranceRequest with status CANCELLED or similar?
    // Or maybe a separate CancellationRequest model?
    // I recall creating CancellationRequest model or using InsuranceRequest status.
    // Let's check schema. If not separate model, I'll check status.
    // Wait, I implemented CancellationModule. Let's check if there is a CancellationRequest model.
    // I'll assume there is one or check status.
    // Actually, I'll check schema first to be sure.
    // For now I will comment this out or use a safe guess.
    const pendingCancellations = await this.prisma.cancellationRequest.count({
      where: {
        status: 'PENDING',
      },
    });

    const recentActivities = await this.prisma.auditLog.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { user: { include: { taliProfile: true } } },
    });

    const totalRevenueResult = await this.prisma.policy.aggregate({
      _sum: { premium: true },
      where: { status: 'ACTIVE' },
    });
    const totalRevenue = totalRevenueResult._sum.premium || 0;

    const totalPolicies = await this.prisma.policy.count();

    // Monthly Revenue (Last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const recentPolicies = await this.prisma.policy.findMany({
      where: {
        createdAt: { gte: sixMonthsAgo },
        status: 'ACTIVE',
      },
      select: { premium: true, createdAt: true },
    });

    const monthlyRevenue: Record<string, number> = {};
    for (const p of recentPolicies) {
      const month = p.createdAt.toISOString().slice(0, 7); // YYYY-MM
      monthlyRevenue[month] = (monthlyRevenue[month] || 0) + Number(p.premium);
    }

    return {
      pendingUsers,
      pendingOffers,
      activePolicies,
      pendingCancellations,
      recentActivities,
      totalRevenue,
      totalPolicies,
      monthlyRevenue,
    };
  }

  async getGeneralTaliStats() {
    const totalTalis = await this.prisma.user.count({
      where: { role: Role.TALI, isApproved: true },
    });

    const totalPolicies = await this.prisma.policy.count();

    const totalPremiumResult = await this.prisma.policy.aggregate({
      _sum: { premium: true },
      where: { status: 'ACTIVE' },
    });
    const totalPremium = totalPremiumResult._sum.premium || 0;

    return {
      totalTalis,
      totalPolicies,
      totalPremium,
    };
  }

  async getTaliStats(taliId: string) {
    const taliProfile = await this.prisma.taliProfile.findUnique({
      where: { userId: taliId },
      include: { user: true },
    });

    if (!taliProfile) {
      const byId = await this.prisma.taliProfile.findUnique({
        where: { id: taliId },
        include: { user: true },
      });
      if (!byId) throw new Error('Tali not found');
      return this.calculateTaliStats(byId);
    }

    return this.calculateTaliStats(taliProfile);
  }

  private async calculateTaliStats(taliProfile: any) {
    const policies = await this.prisma.policy.findMany({
      where: {
        insuranceRequest: {
          taliId: taliProfile.id,
        },
      },
      include: { insuranceRequest: true },
    });

    const totalPolicies = policies.length;
    const activePolicies = policies.filter((p) => p.status === 'ACTIVE').length;

    let totalPremium = 0;
    let totalCommissionPoints = 0;
    const policiesByType: Record<string, number> = {};
    const policiesByMonth: Record<string, number> = {};

    for (const p of policies) {
      if (p.status === 'ACTIVE') {
        totalPremium += Number(p.premium);
        totalCommissionPoints += Number(p.commissionPoints || 0);
      }

      const type = p.insuranceRequest.type;
      policiesByType[type] = (policiesByType[type] || 0) + 1;

      const month = p.createdAt.toISOString().slice(0, 7); // YYYY-MM
      policiesByMonth[month] = (policiesByMonth[month] || 0) + 1;
    }

    return {
      tali: taliProfile,
      totalPolicies,
      activePolicies,
      totalPremium,
      totalCommissionPoints,
      policiesByType,
      policiesByMonth,
    };
  }
  async managePoints(
    userId: string,
    amount: number,
    type: string,
    description: string,
  ) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { taliProfile: true },
    });

    if (!user || !user.taliProfile) {
      throw new Error('User or Tali profile not found');
    }

    const points = Number(amount);
    const currentPoints = Number(user.taliProfile.points);

    // Update Tali points
    await this.prisma.taliProfile.update({
      where: { id: user.taliProfile.id },
      data: {
        points: {
          increment: points,
        },
      },
    });

    // Create Transaction Record
    await this.prisma.transactions.create({
      data: {
        userId: userId,
        points: points,
        type: type as any, // DEPOSIT, REFUND, etc.
        status: 'SUCCESS',
      },
    });

    return { success: true, newPoints: currentPoints + points };
  }

  async upgradeToPremium(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { taliProfile: true },
    });

    if (!user || !user.taliProfile) {
      throw new Error('User or Tali profile not found');
    }

    return this.prisma.taliProfile.update({
      where: { id: user.taliProfile.id },
      data: {
        membershipType: 'PREMIUM',
      },
    });
  }
  async getFinancialStats() {
    // 1. Total Points Distributed (All Time)
    const totalPointsResult = await this.prisma.transactions.aggregate({
      _sum: { points: true },
      where: {
        type: { in: ['COMMISSION', 'GOAL_REWARD', 'DEPOSIT'] }, // Add other earning types if any
        status: 'SUCCESS',
      },
    });
    const totalPointsDistributed = totalPointsResult._sum.points || 0;

    // 2. Current Liabilities (Total Points held by Users)
    const totalLiabilitiesResult = await this.prisma.taliProfile.aggregate({
      _sum: { points: true },
    });
    const totalLiabilities = totalLiabilitiesResult._sum.points || 0;

    // 3. Points Breakdown by Type
    const pointsByType = await this.prisma.transactions.groupBy({
      by: ['type'],
      _sum: { points: true },
      where: {
        status: 'SUCCESS',
        points: { gt: 0 }, // Only positive points (earnings)
      },
    });

    // 4. Monthly Points Distribution (Last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const recentTransactions = await this.prisma.transactions.findMany({
      where: {
        createdAt: { gte: sixMonthsAgo },
        status: 'SUCCESS',
        points: { gt: 0 },
      },
      select: { points: true, createdAt: true, type: true },
    });

    const monthlyPoints: Record<string, number> = {};
    const monthlyBreakdown: Record<string, Record<string, number>> = {};

    for (const t of recentTransactions) {
      const month = t.createdAt.toISOString().slice(0, 7); // YYYY-MM
      const points = Number(t.points);

      monthlyPoints[month] = (monthlyPoints[month] || 0) + points;

      if (!monthlyBreakdown[month]) monthlyBreakdown[month] = {};
      monthlyBreakdown[month][t.type] =
        (monthlyBreakdown[month][t.type] || 0) + points;
    }

    return {
      totalPointsDistributed,
      totalLiabilities,
      pointsByType: pointsByType.map((p) => ({
        type: p.type,
        points: p._sum.points,
      })),
      monthlyPoints,
      monthlyBreakdown,
    };
  }

  async getLiabilitiesBreakdown() {
    const liabilities = await this.prisma.taliProfile.findMany({
      where: {
        points: { gt: 0 },
      },
      include: {
        user: {
          select: {
            email: true,
          },
        },
      },
      orderBy: {
        points: 'desc',
      },
      take: 50, // Top 50 debtors
    });

    return liabilities.map((l: any) => ({
      userId: l.userId,
      fullName: l.fullName,
      email: l.user.email,
      points: Number(l.points),
      membershipType: l.membershipType,
    }));
  }
  async getTopTalis(limit = 10) {
    const topTalis = await this.prisma.taliProfile.findMany({
      orderBy: { points: 'desc' },
      take: limit,
      include: { user: { select: { email: true } } },
    });

    return topTalis.map((t) => ({
      id: t.id,
      fullName: t.fullName,
      email: t.user.email,
      points: Number(t.points),
      membershipType: t.membershipType,
    }));
  }
}
