import { PremiumService } from './premium.service';
export declare class PremiumController {
    private readonly premiumService;
    constructor(premiumService: PremiumService);
    createRequest(req: any, body: {
        paymentMethod: string;
    }): Promise<{
        id: string;
        status: import("@prisma/client").$Enums.PremiumRequestStatus;
        paymentMethod: string;
        createdAt: Date;
        updatedAt: Date;
        taliId: string;
    }>;
    findAllRequests(): Promise<({
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
        status: import("@prisma/client").$Enums.PremiumRequestStatus;
        paymentMethod: string;
        createdAt: Date;
        updatedAt: Date;
        taliId: string;
    })[]>;
    approveRequest(id: string): Promise<[{
        id: string;
        status: import("@prisma/client").$Enums.PremiumRequestStatus;
        paymentMethod: string;
        createdAt: Date;
        updatedAt: Date;
        taliId: string;
    }, {
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
    }]>;
    rejectRequest(id: string): Promise<{
        id: string;
        status: import("@prisma/client").$Enums.PremiumRequestStatus;
        paymentMethod: string;
        createdAt: Date;
        updatedAt: Date;
        taliId: string;
    }>;
}
