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
    async sendWhatsapp(phone, message) {
        this.logger.log(`[WHATSAPP] Sending to ${phone}: ${message}`);
        return true;
    }
    async notifyCancellationStatus(policyId, status, userId) {
        this.logger.log(`[NOTIFY] Cancellation status ${status} for policy ${policyId} to user ${userId}`);
        return this.createSystemNotification(userId, 'Cancellation Update', `Your cancellation request is ${status}`);
    }
    async notifyAdmins(title, message) {
        this.logger.log(`[NOTIFY] Admin notification: ${title} - ${message}`);
        return true;
    }
    async notifyOfferReady(userId, requestId) {
        this.logger.log(`[NOTIFY] Offer ready for request ${requestId} to user ${userId}`);
        return this.createSystemNotification(userId, 'Offer Ready', 'Your insurance offer is ready.');
    }
    async notifyPolicyCreated(userId, policyNumber) {
        this.logger.log(`[NOTIFY] Policy created ${policyNumber} to user ${userId}`);
        return this.createSystemNotification(userId, 'Policy Created', 'Your policy has been created.');
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
    async notifyMarketPurchase(purchaseId, userId, status = 'PENDING') {
        this.logger.log(`[NOTIFY] Market purchase ${purchaseId} for user ${userId} status ${status}`);
        return this.createSystemNotification(userId, 'Market Purchase', `Your purchase is ${status}.`);
    }
    async sendNotification(dto) {
        return this.createSystemNotification(dto.userId, dto.title, dto.message);
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
        return this.createSystemNotification(userId, 'Premium Request Update', `Your premium request is ${status}`);
    }
};
exports.NotificationService = NotificationService;
exports.NotificationService = NotificationService = NotificationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], NotificationService);
//# sourceMappingURL=notification.service.js.map