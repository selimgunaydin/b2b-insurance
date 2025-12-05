import { AdminService } from './admin.service';
export declare class DashboardController {
    private readonly adminService;
    constructor(adminService: AdminService);
    getStats(): Promise<{
        pendingUsers: number;
        pendingOffers: number;
        activePolicies: number;
        pendingCancellations: number;
        recentActivities: ({
            user: {
                taliProfile: {
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
                } | null;
            } & {
                role: import("@prisma/client").$Enums.Role;
                isApproved: boolean;
                id: string;
                createdAt: Date;
                email: string;
                password: string;
                updatedAt: Date;
            };
        } & {
            id: string;
            userId: string;
            action: string;
            details: import("@prisma/client/runtime/library").JsonValue | null;
            ipAddress: string | null;
            createdAt: Date;
        })[];
        totalRevenue: number | import("@prisma/client/runtime/library").Decimal;
        totalPolicies: number;
        monthlyRevenue: Record<string, number>;
        onlineUsers: number;
    }>;
    getFinancials(): Promise<{
        totalPointsDistributed: number | import("@prisma/client/runtime/library").Decimal;
        totalLiabilities: number | import("@prisma/client/runtime/library").Decimal;
        pointsByType: {
            type: import("@prisma/client").$Enums.TransactionType;
            points: import("@prisma/client/runtime/library").Decimal | null;
        }[];
        monthlyPoints: Record<string, number>;
        monthlyBreakdown: Record<string, Record<string, number>>;
    }>;
    getTopTalis(limit?: number): Promise<{
        id: string;
        fullName: string;
        email: string;
        points: number;
        membershipType: import("@prisma/client").$Enums.MembershipType;
    }[]>;
}
