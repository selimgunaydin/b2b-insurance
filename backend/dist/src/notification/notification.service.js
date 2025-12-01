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
var NotificationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
const schedule_1 = require("@nestjs/schedule");
let NotificationService = NotificationService_1 = class NotificationService {
    prisma;
    logger = new common_1.Logger(NotificationService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async sendNotification(dto) {
        if (dto.target === 'ALL') {
            const talis = await this.prisma.user.findMany({
                where: { role: client_1.Role.TALI },
            });
            const notifications = talis.map((tali) => ({
                userId: tali.id,
                title: dto.title || 'Duyuru',
                message: dto.message,
                type: client_1.NotificationType.ADMIN_MESSAGE,
            }));
            await this.prisma.notification.createMany({
                data: notifications,
            });
            return { success: true, count: notifications.length };
        }
        return { success: false, message: 'Only ALL target supported for now' };
    }
    async notifyAdmins(title, message) {
        const admins = await this.prisma.user.findMany({
            where: { role: client_1.Role.ADMIN },
        });
        const notifications = admins.map((admin) => ({
            userId: admin.id,
            title,
            message,
            type: client_1.NotificationType.SYSTEM,
        }));
        if (notifications.length > 0) {
            await this.prisma.notification.createMany({
                data: notifications,
            });
        }
    }
    async createSystemNotification(userId, title, message, type = client_1.NotificationType.SYSTEM) {
        return this.prisma.notification.create({
            data: {
                userId,
                title,
                message,
                type,
            },
        });
    }
    async findAll(userId) {
        return this.prisma.notification.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async markAsRead(id, userId) {
        return this.prisma.notification.update({
            where: { id, userId },
            data: { isRead: true },
        });
    }
    async markAllAsRead(userId) {
        return this.prisma.notification.updateMany({
            where: { userId, isRead: false },
            data: { isRead: true },
        });
    }
    async handleCron() {
        this.logger.debug('Checking for policy renewals...');
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
        const startOfDay = new Date(oneYearAgo);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(oneYearAgo);
        endOfDay.setHours(23, 59, 59, 999);
        const expiringPolicies = await this.prisma.insuranceRequest.findMany({
            where: {
                status: 'COMPLETED',
                updatedAt: {
                    gte: startOfDay,
                    lte: endOfDay,
                },
            },
            include: {
                customer: true,
            },
        });
        for (const policy of expiringPolicies) {
            await this.createSystemNotification(policy.taliId, 'Poliçe Yenileme Hatırlatması', `Müşteriniz ${policy.customer?.fullName || 'Bilinmeyen'} için poliçe süresi dolmak üzere (1 yıl geçti). Lütfen yenileme teklifi oluşturun.`, client_1.NotificationType.RENEWAL);
        }
        if (expiringPolicies.length > 0) {
            this.logger.log(`Sent ${expiringPolicies.length} renewal notifications.`);
        }
    }
};
exports.NotificationService = NotificationService;
__decorate([
    (0, schedule_1.Cron)('0 9 * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], NotificationService.prototype, "handleCron", null);
exports.NotificationService = NotificationService = NotificationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], NotificationService);
//# sourceMappingURL=notification.service.js.map