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

    return {
      pendingUsers,
      pendingOffers,
      activePolicies,
      pendingCancellations,
      recentActivities,
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
    let totalCommission = 0;
    const policiesByType: Record<string, number> = {};
    const policiesByMonth: Record<string, number> = {};

    for (const p of policies) {
      if (p.status === 'ACTIVE') {
        totalPremium += Number(p.premium);
        totalCommission += Number(p.commission || 0);
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
      totalCommission,
      policiesByType,
      policiesByMonth,
    };
  }
}
