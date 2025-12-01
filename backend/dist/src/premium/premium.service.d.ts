import { PrismaService } from '../prisma/prisma.service';
import { NotificationService } from '../notification/notification.service';
export declare class PremiumService {
    private prisma;
    private notificationService;
    constructor(prisma: PrismaService, notificationService: NotificationService);
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
        createdAt: Date;
        updatedAt: Date;
        taliId: string;
        status: import("@prisma/client").$Enums.PremiumRequestStatus;
        paymentMethod: string;
    }>;
}
