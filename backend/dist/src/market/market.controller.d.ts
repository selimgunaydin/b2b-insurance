import { MarketService } from './market.service';
import { PurchaseStatus } from '@prisma/client';
export declare class MarketController {
    private readonly marketService;
    constructor(marketService: MarketService);
    getAllProducts(activeOnly?: string): Promise<{
        id: string;
        name: string;
        description: string | null;
        imageUrl: string | null;
        pointCost: number;
        stock: number;
        isActive: boolean;
        type: import("@prisma/client").$Enums.ProductType;
        category: string | null;
        createdAt: Date;
        updatedAt: Date;
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
        name: string;
        description: string | null;
        imageUrl: string | null;
        pointCost: number;
        stock: number;
        isActive: boolean;
        type: import("@prisma/client").$Enums.ProductType;
        category: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateProduct(id: string, data: any): Promise<{
        id: string;
        name: string;
        description: string | null;
        imageUrl: string | null;
        pointCost: number;
        stock: number;
        isActive: boolean;
        type: import("@prisma/client").$Enums.ProductType;
        category: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    deleteProduct(id: string): Promise<{
        id: string;
        name: string;
        description: string | null;
        imageUrl: string | null;
        pointCost: number;
        stock: number;
        isActive: boolean;
        type: import("@prisma/client").$Enums.ProductType;
        category: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    purchaseProduct(productId: string, req: any, body: {
        details?: any;
    }): Promise<{
        id: string;
        pointCost: number;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.PurchaseStatus;
        details: import("@prisma/client/runtime/library").JsonValue | null;
        fulfillmentData: import("@prisma/client/runtime/library").JsonValue | null;
        adminNote: string | null;
        taliId: string;
        productId: string;
    }>;
    getMyPurchases(req: any): Promise<({
        product: {
            id: string;
            name: string;
            description: string | null;
            imageUrl: string | null;
            pointCost: number;
            stock: number;
            isActive: boolean;
            type: import("@prisma/client").$Enums.ProductType;
            category: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        pointCost: number;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.PurchaseStatus;
        details: import("@prisma/client/runtime/library").JsonValue | null;
        fulfillmentData: import("@prisma/client/runtime/library").JsonValue | null;
        adminNote: string | null;
        taliId: string;
        productId: string;
    })[]>;
    getAllPurchases(): Promise<({
        product: {
            id: string;
            name: string;
            description: string | null;
            imageUrl: string | null;
            pointCost: number;
            stock: number;
            isActive: boolean;
            type: import("@prisma/client").$Enums.ProductType;
            category: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
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
    } & {
        id: string;
        pointCost: number;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.PurchaseStatus;
        details: import("@prisma/client/runtime/library").JsonValue | null;
        fulfillmentData: import("@prisma/client/runtime/library").JsonValue | null;
        adminNote: string | null;
        taliId: string;
        productId: string;
    })[]>;
    updatePurchaseStatus(id: string, body: {
        status: PurchaseStatus;
        fulfillmentData?: any;
        adminNote?: string;
    }): Promise<{
        id: string;
        pointCost: number;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.PurchaseStatus;
        details: import("@prisma/client/runtime/library").JsonValue | null;
        fulfillmentData: import("@prisma/client/runtime/library").JsonValue | null;
        adminNote: string | null;
        taliId: string;
        productId: string;
    }>;
}
