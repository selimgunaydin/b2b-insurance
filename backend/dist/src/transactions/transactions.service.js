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
exports.TransactionsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let TransactionsService = class TransactionsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getMyTransactions(userId) {
        return this.prisma.transactions.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async getUserTransactions(userId) {
        return this.prisma.transactions.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async adjustPoints(userId, amount, type, description) {
        return this.prisma.$transaction(async (prisma) => {
            const transaction = await prisma.transactions.create({
                data: {
                    userId,
                    points: amount,
                    type: type,
                    status: 'SUCCESS',
                    description,
                },
            });
            const taliProfile = await prisma.taliProfile.findUnique({
                where: { userId },
            });
            if (taliProfile) {
                await prisma.taliProfile.update({
                    where: { id: taliProfile.id },
                    data: {
                        points: {
                            increment: amount,
                        },
                    },
                });
            }
            return transaction;
        });
    }
};
exports.TransactionsService = TransactionsService;
exports.TransactionsService = TransactionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TransactionsService);
//# sourceMappingURL=transactions.service.js.map