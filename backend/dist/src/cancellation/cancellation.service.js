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
exports.CancellationService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const notification_service_1 = require("../notification/notification.service");
let CancellationService = class CancellationService {
    prisma;
    notificationService;
    constructor(prisma, notificationService) {
        this.prisma = prisma;
        this.notificationService = notificationService;
    }
    async create(dto) {
        const existingRequest = await this.prisma.cancellationRequest.findUnique({
            where: { policyId: dto.policyId },
        });
        if (existingRequest) {
            if (existingRequest.status === 'REJECTED') {
                throw new common_1.BadRequestException('Bu poliçe için daha önce gönderilen iptal talebi reddedilmiştir. Yeni talep oluşturamazsınız.');
            }
            if (existingRequest.status === 'APPROVED') {
                throw new common_1.BadRequestException('Bu poliçe için iptal talebi zaten onaylanmıştır.');
            }
            if (existingRequest.status === 'PENDING') {
                throw new common_1.BadRequestException('Bu poliçe için zaten bekleyen bir iptal talebiniz bulunmaktadır.');
            }
        }
        const insuranceRequest = await this.prisma.insuranceRequest.findUnique({
            where: { id: dto.policyId },
            include: { policy: true },
        });
        if (!insuranceRequest) {
            throw new common_1.BadRequestException('Poliçe bulunamadı.');
        }
        if (insuranceRequest.status === 'CANCELLED') {
            throw new common_1.BadRequestException('Bu poliçe zaten iptal edilmiştir. Yeni iptal talebi oluşturamazsınız.');
        }
        if (insuranceRequest.policy?.status === 'CANCELLED') {
            throw new common_1.BadRequestException('Bu poliçe zaten iptal edilmiştir. Yeni iptal talebi oluşturamazsınız.');
        }
        return this.prisma.cancellationRequest.create({
            data: {
                policyId: dto.policyId,
                reason: dto.reason,
                contactPhone: dto.contactPhone,
                proofFiles: dto.proofFiles || [],
            },
        });
    }
    async findAll() {
        return this.prisma.cancellationRequest.findMany({
            include: {
                policy: {
                    include: {
                        tali: true,
                        customer: true,
                        policy: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findByUser(userId) {
        const taliProfile = await this.prisma.taliProfile.findUnique({
            where: { userId },
        });
        if (!taliProfile) {
            return [];
        }
        return this.prisma.cancellationRequest.findMany({
            where: {
                policy: {
                    taliId: taliProfile.id,
                },
            },
            include: {
                policy: {
                    include: {
                        customer: true,
                        policy: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async updateStatus(id, dto) {
        const request = await this.prisma.cancellationRequest.update({
            where: { id },
            data: {
                status: dto.status,
                adminResponse: dto.adminResponse,
            },
            include: {
                policy: {
                    include: {
                        policy: true,
                        tali: true,
                    },
                },
            },
        });
        if (request.policy && request.policy.tali) {
            const statusMessage = dto.status === 'APPROVED'
                ? 'onaylandı'
                : dto.status === 'REJECTED'
                    ? 'reddedildi'
                    : 'güncellendi';
            const policyNumber = request.policy.policy?.policyNumber || 'Beklemede';
            await this.notificationService.createSystemNotification(request.policy.tali.userId, 'İptal Talebi Güncellendi', `Poliçe ${policyNumber} için iptal talebiniz ${statusMessage}.${dto.adminResponse ? ` Açıklama: ${dto.adminResponse}` : ''}`, 'CANCELLATION');
        }
        return request;
    }
};
exports.CancellationService = CancellationService;
exports.CancellationService = CancellationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notification_service_1.NotificationService])
], CancellationService);
//# sourceMappingURL=cancellation.service.js.map