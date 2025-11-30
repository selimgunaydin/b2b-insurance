import { PrismaService } from '../prisma/prisma.service';
import { PurchaseStatus } from '@prisma/client';
export declare class MarketService {
    private prisma;
    constructor(prisma: PrismaService);
    getAllProducts(activeOnly?: boolean): Promise<{
        id: string;
        type: import("@prisma/client").$Enums.ProductType;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        category: string | null;
        description: string | null;
        imageUrl: string | null;
        pointCost: number;
        stock: number;
        isActive: boolean;
    }[]>;
    createProduct(data: {
        name: string;
        description?: string;
        imageUrl?: string;
        pointCost: number;
        stock: number;
        type?: 'PHYSICAL' | 'DIGITAL';
        category?: string;
    }): Promise<{
        id: string;
        type: import("@prisma/client").$Enums.ProductType;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        category: string | null;
        description: string | null;
        imageUrl: string | null;
        pointCost: number;
        stock: number;
        isActive: boolean;
    }>;
    updateProduct(id: string, data: any): Promise<{
        id: string;
        type: import("@prisma/client").$Enums.ProductType;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        category: string | null;
        description: string | null;
        imageUrl: string | null;
        pointCost: number;
        stock: number;
        isActive: boolean;
    }>;
    deleteProduct(id: string): Promise<{
        id: string;
        type: import("@prisma/client").$Enums.ProductType;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        category: string | null;
        description: string | null;
        imageUrl: string | null;
        pointCost: number;
        stock: number;
        isActive: boolean;
    }>;
    purchaseProduct(userId: string, productId: string, details?: any): Promise<{
        status: import("@prisma/client").$Enums.PurchaseStatus;
        id: string;
        taliId: string;
        details: import("@prisma/client/runtime/library").JsonValue | null;
        createdAt: Date;
        updatedAt: Date;
        pointCost: number;
        fulfillmentData: import("@prisma/client/runtime/library").JsonValue | null;
        adminNote: string | null;
        productId: string;
    }>;
    getMyPurchases(userId: string): Promise<({
        product: {
            id: string;
            type: import("@prisma/client").$Enums.ProductType;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            category: string | null;
            description: string | null;
            imageUrl: string | null;
            pointCost: number;
            stock: number;
            isActive: boolean;
        };
    } & {
        status: import("@prisma/client").$Enums.PurchaseStatus;
        id: string;
        taliId: string;
        details: import("@prisma/client/runtime/library").JsonValue | null;
        createdAt: Date;
        updatedAt: Date;
        pointCost: number;
        fulfillmentData: import("@prisma/client/runtime/library").JsonValue | null;
        adminNote: string | null;
        productId: string;
    })[]>;
    getAllPurchases(): Promise<({
        tali: {
            user: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                email: string;
                password: string;
                role: import("@prisma/client").$Enums.Role;
                isApproved: boolean;
            };
        } & {
            id: string;
            userId: string;
            fullName: string;
            tcKimlikNo: string | null;
            phone: string | null;
            address: string | null;
            birthDate: Date | null;
            membershipType: import("@prisma/client").$Enums.MembershipType;
            points: import("@prisma/client/runtime/library").Decimal;
            trustScore: number;
            hasKvkkApproval: boolean;
            hasContractApproval: boolean;
            allowedInsuranceTypes: string[];
        };
        product: {
            id: string;
            type: import("@prisma/client").$Enums.ProductType;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            category: string | null;
            description: string | null;
            imageUrl: string | null;
            pointCost: number;
            stock: number;
            isActive: boolean;
        };
    } & {
        status: import("@prisma/client").$Enums.PurchaseStatus;
        id: string;
        taliId: string;
        details: import("@prisma/client/runtime/library").JsonValue | null;
        createdAt: Date;
        updatedAt: Date;
        pointCost: number;
        fulfillmentData: import("@prisma/client/runtime/library").JsonValue | null;
        adminNote: string | null;
        productId: string;
    })[]>;
    updatePurchaseStatus(id: string, status: PurchaseStatus, fulfillmentData?: any, adminNote?: string): Promise<{
        status: import("@prisma/client").$Enums.PurchaseStatus;
        id: string;
        taliId: string;
        details: import("@prisma/client/runtime/library").JsonValue | null;
        createdAt: Date;
        updatedAt: Date;
        pointCost: number;
        fulfillmentData: import("@prisma/client/runtime/library").JsonValue | null;
        adminNote: string | null;
        productId: string;
    }>;
}
