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
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
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
        description: string | null;
        isActive: boolean;
        imageUrl: string | null;
        pointCost: number;
        stock: number;
    }>;
    purchaseProduct(req: any, productId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        taliId: string;
        status: import("@prisma/client").$Enums.PurchaseStatus;
        pointCost: number;
        productId: string;
    }>;
    getMyPurchases(req: any): Promise<({
        product: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
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
        status: import("@prisma/client").$Enums.PurchaseStatus;
        pointCost: number;
        productId: string;
    })[]>;
    getAllPurchases(): Promise<({
        product: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
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
            allowedInsuranceTypes: string[];
            userId: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        taliId: string;
        status: import("@prisma/client").$Enums.PurchaseStatus;
        pointCost: number;
        productId: string;
    })[]>;
    updatePurchaseStatus(id: string, status: PurchaseStatus): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        taliId: string;
        status: import("@prisma/client").$Enums.PurchaseStatus;
        pointCost: number;
        productId: string;
    }>;
}
