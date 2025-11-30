import { MarketService } from './market.service';
import { PurchaseStatus } from '@prisma/client';
export declare class MarketController {
    private readonly marketService;
    constructor(marketService: MarketService);
    getAllProducts(activeOnly?: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        type: import("@prisma/client").$Enums.ProductType;
        category: string | null;
        description: string | null;
        isActive: boolean;
        imageUrl: string | null;
        pointCost: number;
        stock: number;
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
        createdAt: Date;
        updatedAt: Date;
        name: string;
        type: import("@prisma/client").$Enums.ProductType;
        category: string | null;
        description: string | null;
        isActive: boolean;
        imageUrl: string | null;
        pointCost: number;
        stock: number;
    }>;
    updateProduct(id: string, data: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        type: import("@prisma/client").$Enums.ProductType;
        category: string | null;
        description: string | null;
        isActive: boolean;
        imageUrl: string | null;
        pointCost: number;
        stock: number;
    }>;
    deleteProduct(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        type: import("@prisma/client").$Enums.ProductType;
        category: string | null;
        description: string | null;
        isActive: boolean;
        imageUrl: string | null;
        pointCost: number;
        stock: number;
    }>;
    purchaseProduct(productId: string, req: any, body: {
        details?: any;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        details: import("@prisma/client/runtime/library").JsonValue | null;
        taliId: string;
        status: import("@prisma/client").$Enums.PurchaseStatus;
        pointCost: number;
        fulfillmentData: import("@prisma/client/runtime/library").JsonValue | null;
        adminNote: string | null;
        productId: string;
    }>;
    getMyPurchases(req: any): Promise<({
        product: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            type: import("@prisma/client").$Enums.ProductType;
            category: string | null;
            description: string | null;
            isActive: boolean;
            imageUrl: string | null;
            pointCost: number;
            stock: number;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        details: import("@prisma/client/runtime/library").JsonValue | null;
        taliId: string;
        status: import("@prisma/client").$Enums.PurchaseStatus;
        pointCost: number;
        fulfillmentData: import("@prisma/client/runtime/library").JsonValue | null;
        adminNote: string | null;
        productId: string;
    })[]>;
    getAllPurchases(): Promise<({
        product: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            type: import("@prisma/client").$Enums.ProductType;
            category: string | null;
            description: string | null;
            isActive: boolean;
            imageUrl: string | null;
            pointCost: number;
            stock: number;
        };
        tali: {
            user: {
                id: string;
                email: string;
                password: string;
                role: import("@prisma/client").$Enums.Role;
                isApproved: boolean;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            id: string;
            membershipType: import("@prisma/client").$Enums.MembershipType;
            fullName: string;
            tcKimlikNo: string | null;
            phone: string | null;
            address: string | null;
            birthDate: Date | null;
            hasKvkkApproval: boolean;
            hasContractApproval: boolean;
            points: import("@prisma/client/runtime/library").Decimal;
            trustScore: number;
            allowedInsuranceTypes: string[];
            userId: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        details: import("@prisma/client/runtime/library").JsonValue | null;
        taliId: string;
        status: import("@prisma/client").$Enums.PurchaseStatus;
        pointCost: number;
        fulfillmentData: import("@prisma/client/runtime/library").JsonValue | null;
        adminNote: string | null;
        productId: string;
    })[]>;
    updatePurchaseStatus(id: string, body: {
        status: PurchaseStatus;
        fulfillmentData?: any;
        adminNote?: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        details: import("@prisma/client/runtime/library").JsonValue | null;
        taliId: string;
        status: import("@prisma/client").$Enums.PurchaseStatus;
        pointCost: number;
        fulfillmentData: import("@prisma/client/runtime/library").JsonValue | null;
        adminNote: string | null;
        productId: string;
    }>;
}
