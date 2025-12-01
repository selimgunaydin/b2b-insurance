"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let AdminService = class AdminService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getDashboardStats() {
        const pendingUsers = await this.prisma.user.count({
            where: {
                role: client_1.Role.TALI,
                isApproved: false,
            },
        });
        const pendingOffers = await this.prisma.insuranceRequest.count({
            where: {
                status: client_1.RequestStatus.PENDING_OFFER,
            },
        });
        const activePolicies = await this.prisma.policy.count({
            where: {
                createdAt: {
                    gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                },
            },
        });
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
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        const recentPolicies = await this.prisma.policy.findMany({
            where: {
                createdAt: { gte: sixMonthsAgo },
                status: 'ACTIVE',
            },
            select: { premium: true, createdAt: true },
        });
        const monthlyRevenue = {};
        for (const p of recentPolicies) {
            const month = p.createdAt.toISOString().slice(0, 7);
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
            where: { role: client_1.Role.TALI, isApproved: true },
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
    async getTaliStats(taliId) {
        const taliProfile = await this.prisma.taliProfile.findUnique({
            where: { userId: taliId },
            include: { user: true },
        });
        if (!taliProfile) {
            const byId = await this.prisma.taliProfile.findUnique({
                where: { id: taliId },
                include: { user: true },
            });
            if (!byId)
                throw new Error('Tali not found');
            return this.calculateTaliStats(byId);
        }
        return this.calculateTaliStats(taliProfile);
    }
    async calculateTaliStats(taliProfile) {
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
        const policiesByType = {};
        const policiesByMonth = {};
        for (const p of policies) {
            if (p.status === 'ACTIVE') {
                totalPremium += Number(p.premium);
                totalCommissionPoints += Number(p.commissionPoints || 0);
            }
            const type = p.insuranceRequest.type;
            policiesByType[type] = (policiesByType[type] || 0) + 1;
            const month = p.createdAt.toISOString().slice(0, 7);
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
    async managePoints(userId, amount, type, description) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { taliProfile: true },
        });
        if (!user || !user.taliProfile) {
            throw new Error('User or Tali profile not found');
        }
        const points = Number(amount);
        const currentPoints = Number(user.taliProfile.points);
        await this.prisma.taliProfile.update({
            where: { id: user.taliProfile.id },
            data: {
                points: {
                    increment: points,
                },
            },
        });
        await this.prisma.transactions.create({
            data: {
                userId: userId,
                points: points,
                type: type,
                status: 'SUCCESS',
            },
        });
        return { success: true, newPoints: currentPoints + points };
    }
    async upgradeToPremium(userId) {
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
        const totalPointsResult = await this.prisma.transactions.aggregate({
            _sum: { points: true },
            where: {
                type: { in: ['COMMISSION', 'GOAL_REWARD', 'DEPOSIT'] },
                status: 'SUCCESS',
            },
        });
        const totalPointsDistributed = totalPointsResult._sum.points || 0;
        const totalLiabilitiesResult = await this.prisma.taliProfile.aggregate({
            _sum: { points: true },
        });
        const totalLiabilities = totalLiabilitiesResult._sum.points || 0;
        const pointsByType = await this.prisma.transactions.groupBy({
            by: ['type'],
            _sum: { points: true },
            where: {
                status: 'SUCCESS',
                points: { gt: 0 },
            },
        });
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
        const monthlyPoints = {};
        const monthlyBreakdown = {};
        for (const t of recentTransactions) {
            const month = t.createdAt.toISOString().slice(0, 7);
            const points = Number(t.points);
            monthlyPoints[month] = (monthlyPoints[month] || 0) + points;
            if (!monthlyBreakdown[month])
                monthlyBreakdown[month] = {};
            monthlyBreakdown[month][t.type] = (monthlyBreakdown[month][t.type] || 0) + points;
        }
        return {
            totalPointsDistributed,
            totalLiabilities,
            pointsByType: pointsByType.map(p => ({ type: p.type, points: p._sum.points })),
            monthlyPoints,
            monthlyBreakdown
        };
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminService);
//# sourceMappingURL=admin.service.js.map