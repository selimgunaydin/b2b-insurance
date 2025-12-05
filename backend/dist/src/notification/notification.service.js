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
let NotificationService = NotificationService_1 = class NotificationService {
    prisma;
    logger = new common_1.Logger(NotificationService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    sendWhatsapp(phone, message) {
        this.logger.log(`[WHATSAPP] Sending to ${phone}: ${message}`);
        return Promise.resolve(true);
    }
    async notifyCancellationStatus(userId, status, policyNumber) {
        this.logger.log(`[NOTIFY] Cancellation status ${status} for policy ${policyNumber} to user ${userId}`);
        const statusText = status === 'APPROVED' ? 'onaylandı' : status === 'REJECTED' ? 'reddedildi' : 'güncellendi';
        return this.createSystemNotification(userId, 'İptal Talebi Güncellendi', `Poliçe ${policyNumber} için iptal talebiniz ${statusText}.`, client_1.NotificationType.CANCELLATION);
    }
    notifyAdmins(title, message) {
        this.logger.log(`[NOTIFY] Admin notification: ${title} - ${message}`);
        return Promise.resolve(true);
    }
    async notifyOfferReady(userId, requestId) {
        this.logger.log(`[NOTIFY] Offer ready for request ${requestId} to user ${userId}`);
        return this.createSystemNotification(userId, 'Teklif Hazır', 'Sigorta teklifiniz hazır. Hemen inceleyebilirsiniz.', client_1.NotificationType.OFFER);
    }
    async notifyPolicyCreated(userId, policyNumber) {
        this.logger.log(`[NOTIFY] Policy created ${policyNumber} to user ${userId}`);
        return this.createSystemNotification(userId, 'Poliçe Oluşturuldu', `Poliçe numarası ${policyNumber} olan poliçeniz başarıyla oluşturuldu.`, client_1.NotificationType.POLICY);
    }
    async createSystemNotification(userId, title, message, type = client_1.NotificationType.SYSTEM) {
        if (!userId) {
            this.logger.warn(`[NOTIFY] Cannot create notification: userId is empty`);
            return null;
        }
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            this.logger.warn(`[NOTIFY] Cannot create notification: User ${userId} not found`);
            return null;
        }
        return this.prisma.notification.create({
            data: {
                userId,
                title,
                message,
                type,
            },
        });
    }
    async notifyMarketPurchase(purchaseId, userId, status = 'PENDING') {
        this.logger.log(`[NOTIFY] Market purchase ${purchaseId} for user ${userId} status ${status}`);
        const statusMessages = {
            'PENDING': 'Sipariş alındı ve onay bekliyor.',
            'APPROVED': 'Siparişiniz onaylandı.',
            'SHIPPED': 'Siparişiniz kargoya verildi.',
            'DELIVERED': 'Siparişiniz teslim edildi.',
            'COMPLETED': 'Siparişiniz tamamlandı.',
            'REJECTED': 'Siparişiniz reddedildi.',
        };
        return this.createSystemNotification(userId, 'Market Siparişi', statusMessages[status] || `Sipariş durumu: ${status}`, client_1.NotificationType.MARKET);
    }
    async sendNotification(dto) {
        const type = dto.type || client_1.NotificationType.ADMIN_MESSAGE;
        if (dto.target === 'ALL') {
            const users = await this.prisma.user.findMany({
                where: { role: 'TALI' },
                select: { id: true },
            });
            const notifications = await Promise.all(users.map((user) => this.createSystemNotification(user.id, dto.title, dto.message, type)));
            return { count: notifications.length, success: true };
        }
        if (dto.target === 'USERS' && dto.userIds?.length) {
            const notifications = await Promise.all(dto.userIds.map((userId) => this.createSystemNotification(userId, dto.title, dto.message, type)));
            return { count: notifications.length, success: true };
        }
        if (dto.userId) {
            const notification = await this.createSystemNotification(dto.userId, dto.title, dto.message, type);
            return { count: 1, success: true, notification };
        }
        throw new Error('No valid target specified. Provide userId, userIds with target=USERS, or target=ALL');
    }
    async findAll(userId) {
        return this.prisma.notification.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async getUnreadCount(userId) {
        return this.prisma.notification.count({
            where: { userId, isRead: false },
        });
    }
    async markAsRead(id, userId) {
        return this.prisma.notification.updateMany({
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
    async notifyPremiumStatus(userId, status) {
        this.logger.log(`[NOTIFY] Premium status ${status} to user ${userId}`);
        const statusMessages = {
            'PENDING': 'Premium üyelik talebiniz alındı ve inceleniyor.',
            'APPROVED': 'Tebrikler! Premium üyelik talebiniz onaylandı.',
            'REJECTED': 'Premium üyelik talebiniz reddedildi.',
        };
        return this.createSystemNotification(userId, 'Premium Üyelik', statusMessages[status] || `Premium üyelik durumu: ${status}`, client_1.NotificationType.PREMIUM);
    }
};
exports.NotificationService = NotificationService;
exports.NotificationService = NotificationService = NotificationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], NotificationService);
//# sourceMappingURL=notification.service.js.map