import { AdminService } from './admin.service';
export declare class AdminController {
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
                    membershipType: import("@prisma/client").$Enums.MembershipType;
                    fullName: string;
                    tcKimlikNo: string | null;
                    phone: string | null;
                    address: string | null;
                    birthDate: Date | null;
                    hasKvkkApproval: boolean;
                    hasContractApproval: boolean;
                    balance: import("@prisma/client/runtime/library").Decimal;
                    allowedInsuranceTypes: string[];
                    userId: string;
                } | null;
            } & {
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
            createdAt: Date;
            userId: string;
            action: string;
            details: import("@prisma/client/runtime/library").JsonValue | null;
            ipAddress: string | null;
        })[];
    }>;
    getGeneralStats(): Promise<{
        totalTalis: number;
        totalPolicies: number;
        totalPremium: number | import("@prisma/client/runtime/library").Decimal;
    }>;
    getTaliStats(id: string): Promise<{
        tali: any;
        totalPolicies: number;
        activePolicies: number;
        totalPremium: number;
        totalCommission: number;
        policiesByType: Record<string, number>;
        policiesByMonth: Record<string, number>;
    }>;
}
