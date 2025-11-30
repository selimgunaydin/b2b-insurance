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
exports.MarketService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let MarketService = class MarketService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getAllProducts(activeOnly = true) {
        return this.prisma.product.findMany({
            where: activeOnly ? { isActive: true } : {},
            orderBy: { createdAt: 'desc' },
        });
    }
    async createProduct(data) {
        return this.prisma.product.create({
            data: {
                ...data,
                pointCost: Number(data.pointCost),
                stock: Number(data.stock),
                type: data.type || 'PHYSICAL',
            },
        });
    }
    async updateProduct(id, data) {
        return this.prisma.product.update({
            where: { id },
            data: {
                ...data,
                pointCost: data.pointCost ? Number(data.pointCost) : undefined,
                stock: data.stock ? Number(data.stock) : undefined,
            },
        });
    }
    async deleteProduct(id) {
        return this.prisma.product.delete({
            where: { id },
        });
    }
    async purchaseProduct(userId, productId, details) {
        console.log('purchaseProduct called with userId:', userId);
        const taliProfile = await this.prisma.taliProfile.findUnique({
            where: { userId },
        });
        console.log('TaliProfile found:', taliProfile);
        if (!taliProfile) {
            throw new common_1.BadRequestException('Tali profile not found');
        }
        const product = await this.prisma.product.findUnique({
            where: { id: productId },
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        if (!product.isActive) {
            throw new common_1.BadRequestException('Product is not active');
        }
        if (product.stock <= 0) {
            throw new common_1.BadRequestException('Out of stock');
        }
        if (Number(taliProfile.points) < product.pointCost) {
            throw new common_1.BadRequestException('Insufficient points');
        }
        return this.prisma.$transaction(async (prisma) => {
            await prisma.taliProfile.update({
                where: { id: taliProfile.id },
                data: { points: { decrement: product.pointCost } },
            });
            await prisma.product.update({
                where: { id: productId },
                data: { stock: { decrement: 1 } },
            });
            const purchase = await prisma.marketPurchase.create({
                data: {
                    taliId: taliProfile.id,
                    productId: product.id,
                    pointCost: product.pointCost,
                    status: client_1.PurchaseStatus.PENDING,
                    details: details || {},
                },
            });
            await prisma.transactions.create({
                data: {
                    userId: userId,
                    points: product.pointCost,
                    type: 'MARKET_PURCHASE',
                    status: 'SUCCESS',
                },
            });
            return purchase;
        });
    }
    async getMyPurchases(userId) {
        const taliProfile = await this.prisma.taliProfile.findUnique({
            where: { userId },
        });
        if (!taliProfile)
            return [];
        return this.prisma.marketPurchase.findMany({
            where: { taliId: taliProfile.id },
            include: { product: true },
            orderBy: { createdAt: 'desc' },
        });
    }
    async getAllPurchases() {
        return this.prisma.marketPurchase.findMany({
            include: {
                product: true,
                tali: {
                    include: { user: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async updatePurchaseStatus(id, status, fulfillmentData, adminNote) {
        return this.prisma.marketPurchase.update({
            where: { id },
            data: {
                status,
                fulfillmentData: fulfillmentData || undefined,
                adminNote: adminNote || undefined,
            },
        });
    }
};
exports.MarketService = MarketService;
exports.MarketService = MarketService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MarketService);
//# sourceMappingURL=market.service.js.map