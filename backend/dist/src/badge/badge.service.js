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
var BadgeService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BadgeService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
const notification_service_1 = require("../notification/notification.service");
let BadgeService = BadgeService_1 = class BadgeService {
    prisma;
    notificationService;
    logger = new common_1.Logger(BadgeService_1.name);
    constructor(prisma, notificationService) {
        this.prisma = prisma;
        this.notificationService = notificationService;
    }
    async getAllBadges() {
        return this.prisma.badge.findMany({
            where: { isActive: true },
            orderBy: { createdAt: 'asc' },
        });
    }
    async getTaliBadges(userId) {
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
    async createBadge(data) {
        return this.prisma.badge.create({
            data: {
                name: data.name,
                description: data.description,
                iconUrl: data.iconUrl,
                type: data.type,
                criteria: data.criteria,
                points: data.points || 0,
            },
        });
    }
    async updateBadge(id, data) {
        const { criteria, ...rest } = data;
        const updateData = { ...rest };
        if (criteria) {
            updateData.criteria = criteria;
        }
        return this.prisma.badge.update({
            where: { id },
            data: updateData,
        });
    }
    async deleteBadge(id) {
        await this.prisma.taliBadge.deleteMany({
            where: { badgeId: id },
        });
        return this.prisma.badge.delete({
            where: { id },
        });
    }
    async awardBadge(taliId, badgeId) {
        const taliProfile = await this.prisma.taliProfile.findUnique({
            where: { id: taliId },
        });
        if (!taliProfile) {
            throw new Error('Tali profile not found');
        }
        const existing = await this.prisma.taliBadge.findUnique({
            where: {
                taliId_badgeId: { taliId, badgeId },
            },
        });
        if (existing) {
            return existing;
        }
        const badge = await this.prisma.badge.findUnique({
            where: { id: badgeId },
        });
        if (!badge) {
            throw new Error('Badge not found');
        }
        const taliBadge = await this.prisma.taliBadge.create({
            data: {
                taliId,
                badgeId,
            },
            include: { badge: true },
        });
        if (badge.points > 0) {
            await this.prisma.taliProfile.update({
                where: { id: taliId },
                data: {
                    points: {
                        increment: badge.points,
                    },
                },
            });
        }
        await this.notificationService.createSystemNotification(taliProfile.userId, 'Yeni Rozet Kazandınız! 🏆', `Tebrikler! "${badge.name}" rozetini kazandınız.${badge.points > 0 ? ` +${badge.points} puan eklendi.` : ''}`);
        this.logger.log(`Badge "${badge.name}" awarded to tali ${taliId}`);
        return taliBadge;
    }
    async checkAndAwardBadges(taliId) {
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
            const criteria = badge.criteria;
            let qualified = false;
            switch (badge.type) {
                case 'POLICY_COUNT':
                    const policyCount = criteria.insuranceType
                        ? taliProfile.insuranceRequests.filter((r) => r.type === criteria.insuranceType).length
                        : taliProfile.insuranceRequests.length;
                    qualified = policyCount >= criteria.threshold;
                    break;
                case 'PREMIUM_TOTAL':
                    const totalPremium = taliProfile.insuranceRequests.reduce((sum, r) => sum + (r.policy ? Number(r.policy.premium) : 0), 0);
                    qualified = totalPremium >= criteria.threshold;
                    break;
                case 'CUSTOMER_COUNT':
                    qualified = taliProfile.customers.length >= criteria.threshold;
                    break;
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
    async getLeaderboard(limit = 10) {
        const talis = await this.prisma.taliProfile.findMany({
            include: {
                user: {
                    select: { email: true },
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
            orderBy: [
                { points: 'desc' },
            ],
            take: limit,
        });
        return talis.map((tali, index) => ({
            rank: index + 1,
            id: tali.id,
            fullName: tali.fullName,
            email: tali.user.email,
            points: Number(tali.points),
            badgeCount: tali.badges.length,
            badges: tali.badges.map((tb) => ({
                id: tb.badge.id,
                name: tb.badge.name,
                iconUrl: tb.badge.iconUrl,
            })),
            policyCount: tali._count.insuranceRequests,
            customerCount: tali._count.customers,
            membershipType: tali.membershipType,
        }));
    }
    async initializeDefaultBadges() {
        const defaultBadges = [
            {
                name: 'İlk Adım',
                description: 'İlk poliçenizi oluşturdunuz',
                type: client_1.BadgeType.POLICY_COUNT,
                criteria: { threshold: 1 },
                points: 10,
            },
            {
                name: 'Yıldız Satıcı',
                description: '10 poliçe oluşturdunuz',
                type: client_1.BadgeType.POLICY_COUNT,
                criteria: { threshold: 10 },
                points: 50,
            },
            {
                name: 'Süper Satıcı',
                description: '50 poliçe oluşturdunuz',
                type: client_1.BadgeType.POLICY_COUNT,
                criteria: { threshold: 50 },
                points: 200,
            },
            {
                name: 'Efsane Satıcı',
                description: '100 poliçe oluşturdunuz',
                type: client_1.BadgeType.POLICY_COUNT,
                criteria: { threshold: 100 },
                points: 500,
            },
            {
                name: 'Müşteri Avcısı',
                description: '10 müşteri kazandınız',
                type: client_1.BadgeType.CUSTOMER_COUNT,
                criteria: { threshold: 10 },
                points: 30,
            },
            {
                name: 'Müşteri Ustası',
                description: '50 müşteri kazandınız',
                type: client_1.BadgeType.CUSTOMER_COUNT,
                criteria: { threshold: 50 },
                points: 150,
            },
            {
                name: 'Trafik Uzmanı',
                description: '10 trafik sigortası oluşturdunuz',
                type: client_1.BadgeType.POLICY_COUNT,
                criteria: { threshold: 10, insuranceType: 'TRAFIK' },
                points: 40,
            },
            {
                name: 'Kasko Uzmanı',
                description: '10 kasko sigortası oluşturdunuz',
                type: client_1.BadgeType.POLICY_COUNT,
                criteria: { threshold: 10, insuranceType: 'KASKO' },
                points: 40,
            },
            {
                name: 'DASK Uzmanı',
                description: '10 DASK sigortası oluşturdunuz',
                type: client_1.BadgeType.POLICY_COUNT,
                criteria: { threshold: 10, insuranceType: 'DASK' },
                points: 40,
            },
            {
                name: 'Prim Avcısı',
                description: '100.000 TL prim topladınız',
                type: client_1.BadgeType.PREMIUM_TOTAL,
                criteria: { threshold: 100000 },
                points: 100,
            },
            {
                name: 'Prim Ustası',
                description: '500.000 TL prim topladınız',
                type: client_1.BadgeType.PREMIUM_TOTAL,
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
};
exports.BadgeService = BadgeService;
exports.BadgeService = BadgeService = BadgeService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notification_service_1.NotificationService])
], BadgeService);
//# sourceMappingURL=badge.service.js.map