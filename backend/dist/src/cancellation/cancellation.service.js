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
        return this.prisma.cancellationRequest.create({
            data: {
                policyId: dto.policyId,
                reason: dto.reason,
                proofFiles: dto.proofFiles || [],
            },
        });
    }
    async findAll() {
        return this.prisma.cancellationRequest.findMany({
            include: { policy: true },
        });
    }
    async updateStatus(id, dto) {
        const request = await this.prisma.cancellationRequest.update({
            where: { id },
            data: { status: dto.status },
            include: {
                policy: {
                    include: {
                        policy: true,
                        tali: true,
                    },
                },
            },
        });
        if (request.policy && request.policy.policy) {
            await this.notificationService.notifyCancellationStatus(request.policy.tali.userId, dto.status, request.policy.policy.policyNumber);
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