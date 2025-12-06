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
    getAllCategories(activeOnly?: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        isActive: boolean;
    }[]>;
    createCategory(data: {
        name: string;
        description?: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        isActive: boolean;
    }>;
    updateCategory(id: string, data: {
        name?: string;
        description?: string;
        isActive?: boolean;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        isActive: boolean;
    }>;
    deleteCategory(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        isActive: boolean;
    }>;
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
        taliId: string;
        details: import("@prisma/client/runtime/library").JsonValue | null;
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
        taliId: string;
        details: import("@prisma/client/runtime/library").JsonValue | null;
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
        createdAt: Date;
        updatedAt: Date;
        taliId: string;
        details: import("@prisma/client/runtime/library").JsonValue | null;
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
        createdAt: Date;
        updatedAt: Date;
        taliId: string;
        details: import("@prisma/client/runtime/library").JsonValue | null;
        status: import("@prisma/client").$Enums.PurchaseStatus;
        pointCost: number;
        fulfillmentData: import("@prisma/client/runtime/library").JsonValue | null;
        adminNote: string | null;
        productId: string;
    }>;
}
