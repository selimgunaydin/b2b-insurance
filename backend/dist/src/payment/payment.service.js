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
exports.PaymentService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let PaymentService = class PaymentService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async processPayment(dto) {
        const transaction = await this.prisma.transactions.create({
            data: {
                userId: dto.userId,
                points: dto.amount,
                type: dto.type,
                status: client_1.TransactionStatus.SUCCESS,
            },
        });
        if (dto.type === 'DEPOSIT' || dto.type === 'COMMISSION') {
            await this.prisma.taliProfile.update({
                where: { userId: dto.userId },
                data: { points: { increment: dto.amount } },
            });
        }
        else if (dto.type === 'PAYMENT' || dto.type === 'REFUND' || dto.type === 'MARKET_PURCHASE') {
            await this.prisma.taliProfile.update({
                where: { userId: dto.userId },
                data: { points: { decrement: dto.amount } },
            });
        }
        return transaction;
    }
};
exports.PaymentService = PaymentService;
exports.PaymentService = PaymentService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PaymentService);
//# sourceMappingURL=payment.service.js.map