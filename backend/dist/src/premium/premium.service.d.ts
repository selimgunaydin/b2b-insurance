import { PrismaService } from '../prisma/prisma.service';
export declare class PremiumService {
    private prisma;
    constructor(prisma: PrismaService);
    createRequest(userId: string, paymentMethod: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        taliId: string;
        status: import("@prisma/client").$Enums.PremiumRequestStatus;
        paymentMethod: string;
    }>;
    findAllRequests(): Promise<({
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
        taliId: string;
        status: import("@prisma/client").$Enums.PremiumRequestStatus;
        paymentMethod: string;
    })[]>;
    approveRequest(id: string): Promise<[{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        taliId: string;
        status: import("@prisma/client").$Enums.PremiumRequestStatus;
        paymentMethod: string;
    }, {
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
    }]>;
    rejectRequest(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        taliId: string;
        status: import("@prisma/client").$Enums.PremiumRequestStatus;
        paymentMethod: string;
    }>;
}
