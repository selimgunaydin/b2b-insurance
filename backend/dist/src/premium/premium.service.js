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
exports.PremiumService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
const notification_service_1 = require("../notification/notification.service");
let PremiumService = class PremiumService {
    prisma;
    notificationService;
    constructor(prisma, notificationService) {
        this.prisma = prisma;
        this.notificationService = notificationService;
    }
    async createRequest(userId, paymentMethod) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { taliProfile: true },
        });
        if (!user || !user.taliProfile) {
            throw new Error('User profile not found');
        }
        if (user.taliProfile.membershipType === client_1.MembershipType.PREMIUM) {
            throw new Error('Already a Premium member');
        }
        const pendingRequest = await this.prisma.premiumRequest.findFirst({
            where: {
                taliId: user.taliProfile.id,
                status: client_1.PremiumRequestStatus.PENDING,
            },
        });
        if (pendingRequest) {
            throw new Error('You already have a pending request');
        }
        return this.prisma.premiumRequest.create({
            data: {
                taliId: user.taliProfile.id,
                paymentMethod,
                status: client_1.PremiumRequestStatus.PENDING,
            },
        });
    }
    async findAllRequests() {
        return this.prisma.premiumRequest.findMany({
            include: {
                tali: {
                    include: { user: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async approveRequest(id) {
        const request = await this.prisma.premiumRequest.findUnique({
            where: { id },
            include: { tali: true },
        });
        if (!request)
            throw new Error('Request not found');
        if (request.status !== client_1.PremiumRequestStatus.PENDING) {
            throw new Error('Request is not pending');
        }
        const result = await this.prisma.$transaction([
            this.prisma.premiumRequest.update({
                where: { id },
                data: { status: client_1.PremiumRequestStatus.APPROVED },
            }),
            this.prisma.taliProfile.update({
                where: { id: request.taliId },
                data: { membershipType: client_1.MembershipType.PREMIUM },
            }),
        ]);
        await this.notificationService.notifyPremiumStatus(request.tali.userId, 'APPROVED');
        return result;
    }
    async rejectRequest(id) {
        const request = await this.prisma.premiumRequest.findUnique({
            where: { id },
            include: { tali: true },
        });
        if (!request)
            throw new Error('Request not found');
        const updatedRequest = await this.prisma.premiumRequest.update({
            where: { id },
            data: { status: client_1.PremiumRequestStatus.REJECTED },
        });
        await this.notificationService.notifyPremiumStatus(request.tali.userId, 'REJECTED');
        return updatedRequest;
    }
};
exports.PremiumService = PremiumService;
exports.PremiumService = PremiumService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notification_service_1.NotificationService])
], PremiumService);
//# sourceMappingURL=premium.service.js.map