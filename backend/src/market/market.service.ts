import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PurchaseStatus } from '@prisma/client';

@Injectable()
export class MarketService {
    constructor(private prisma: PrismaService) { }

    async getAllProducts(activeOnly = true) {
        return this.prisma.product.findMany({
            where: activeOnly ? { isActive: true } : {},
            orderBy: { createdAt: 'desc' },
        });
    }

    async createProduct(data: {
        name: string;
        description?: string;
        imageUrl?: string;
        pointCost: number;
        stock: number;
    }) {
        return this.prisma.product.create({
            data: {
                ...data,
                pointCost: Number(data.pointCost),
                stock: Number(data.stock),
            },
        });
    }

    async updateProduct(id: string, data: any) {
        return this.prisma.product.update({
            where: { id },
            data: {
                ...data,
                pointCost: data.pointCost ? Number(data.pointCost) : undefined,
                stock: data.stock ? Number(data.stock) : undefined,
            },
        });
    }

    async deleteProduct(id: string) {
        return this.prisma.product.delete({
            where: { id },
        });
    }

    async purchaseProduct(userId: string, productId: string) {
        const taliProfile = await this.prisma.taliProfile.findUnique({
            where: { userId },
        });

        if (!taliProfile) {
            throw new BadRequestException('Tali profile not found');
        }

        const product = await this.prisma.product.findUnique({
            where: { id: productId },
        });

        if (!product) {
            throw new NotFoundException('Product not found');
        }

        if (!product.isActive) {
            throw new BadRequestException('Product is not active');
        }

        if (product.stock <= 0) {
            throw new BadRequestException('Product is out of stock');
        }

        if (Number(taliProfile.points) < product.pointCost) {
            throw new BadRequestException('Insufficient points');
        }

        return this.prisma.$transaction(async (prisma) => {
            // Deduct points
            await prisma.taliProfile.update({
                where: { id: taliProfile.id },
                data: { points: { decrement: product.pointCost } },
            });

            // Decrement stock
            await prisma.product.update({
                where: { id: productId },
                data: { stock: { decrement: 1 } },
            });

            // Create purchase record
            const purchase = await prisma.marketPurchase.create({
                data: {
                    taliId: taliProfile.id,
                    productId: product.id,
                    pointCost: product.pointCost,
                    status: PurchaseStatus.PENDING,
                },
            });

            // Create Transaction Record (Spending)
            await prisma.transactions.create({
                data: {
                    userId: userId,
                    points: product.pointCost, // Positive value, type indicates spending? Or negative?
                    // Usually transaction amount is absolute, type defines direction.
                    // But PaymentService used decrement for PAYMENT.
                    // Let's use MARKET_PURCHASE type.
                    type: 'MARKET_PURCHASE',
                    status: 'SUCCESS',
                },
            });

            return purchase;
        });
    }

    async getMyPurchases(userId: string) {
        const taliProfile = await this.prisma.taliProfile.findUnique({
            where: { userId },
        });

        if (!taliProfile) return [];

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

    async updatePurchaseStatus(id: string, status: PurchaseStatus) {
        return this.prisma.marketPurchase.update({
            where: { id },
            data: { status },
        });
    }
}
