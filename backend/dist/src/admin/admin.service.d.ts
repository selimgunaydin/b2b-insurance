import { PrismaService } from '../prisma/prisma.service';
import { NotificationGateway } from '../notification/notification.gateway';
export declare class AdminService {
    private prisma;
    private notificationGateway;
    constructor(prisma: PrismaService, notificationGateway: NotificationGateway);
    getDashboardStats(): Promise<{
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
        totalRevenue: number | import("@prisma/client/runtime/library").Decimal;
        totalPolicies: number;
        monthlyRevenue: Record<string, number>;
        onlineUsers: number;
    }>;
    getGeneralTaliStats(): Promise<{
        totalTalis: number;
        totalPolicies: number;
        totalPremium: number | import("@prisma/client/runtime/library").Decimal;
    }>;
    getTaliStats(taliId: string): Promise<{
        tali: any;
        totalPolicies: number;
        activePolicies: number;
        totalPremium: number;
        totalCommissionPoints: number;
        policiesByType: Record<string, number>;
        policiesByMonth: Record<string, number>;
    }>;
    private calculateTaliStats;
    managePoints(userId: string, amount: number, type: string, description: string): Promise<{
        success: boolean;
        newPoints: number;
    }>;
    upgradeToPremium(userId: string): Promise<{
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
    }>;
    getFinancialStats(): Promise<{
        totalPointsDistributed: number | import("@prisma/client/runtime/library").Decimal;
        totalLiabilities: number | import("@prisma/client/runtime/library").Decimal;
        pointsByType: {
            type: import("@prisma/client").$Enums.TransactionType;
            points: import("@prisma/client/runtime/library").Decimal | null;
        }[];
        monthlyPoints: Record<string, number>;
        monthlyBreakdown: Record<string, Record<string, number>>;
    }>;
    getLiabilitiesBreakdown(): Promise<{
        userId: any;
        fullName: any;
        email: any;
        points: number;
        membershipType: any;
    }[]>;
    getTopTalis(limit?: number): Promise<{
        id: string;
        fullName: string;
        email: string;
        points: number;
        membershipType: import("@prisma/client").$Enums.MembershipType;
    }[]>;
    getBroadcastStats(): Promise<{
        activeUsers: number;
        onlineUsers: number;
    }>;
    getRevenueByInsuranceType(startDate?: Date, endDate?: Date): Promise<Record<string, {
        count: number;
        revenue: number;
    }>>;
    getPolicyCancellationRatio(startDate?: Date, endDate?: Date): Promise<{
        totalPolicies: number;
        cancelledPolicies: number;
        cancellationRequests: number;
        approvedCancellations: number;
        rejectedCancellations: number;
        cancellationRate: number;
    }>;
    getConsolidatedAnalytics(startDate?: Date, endDate?: Date): Promise<{
        overview: {
            totalTalis: number;
            totalPolicies: number;
            totalRevenue: number;
            totalGrossProfit: number;
            totalCommissionsPaid: number;
            totalNetProfit: number;
            lostRevenue: number;
            cancelledPolicies: number;
        };
        revenueByType: Record<string, {
            count: number;
            revenue: number;
            grossProfit: number;
            commissionsPaid: number;
            netProfit: number;
        }>;
        cancellationStats: {
            totalPolicies: number;
            cancelledPolicies: number;
            cancellationRequests: number;
            approvedCancellations: number;
            rejectedCancellations: number;
            cancellationRate: number;
        };
        profitRates: Record<string, number>;
        commissionRates: Record<string, number>;
        profitsByType: Record<string, number>;
        liabilities: {
            totalPointsDistributed: number | import("@prisma/client/runtime/library").Decimal;
            totalLiabilities: number | import("@prisma/client/runtime/library").Decimal;
        };
        monthlyPoints: Record<string, number>;
    }>;
    updateProfitRates(rates: Record<string, number>): Promise<{
        success: boolean;
    }>;
}
