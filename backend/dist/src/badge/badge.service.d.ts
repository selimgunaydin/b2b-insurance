import { PrismaService } from '../prisma/prisma.service';
import { BadgeType, Prisma } from '@prisma/client';
import { NotificationService } from '../notification/notification.service';
interface BadgeCriteria {
    threshold: number;
    insuranceType?: string;
    [key: string]: unknown;
}
export declare class BadgeService {
    private prisma;
    private notificationService;
    private readonly logger;
    constructor(prisma: PrismaService, notificationService: NotificationService);
    getAllBadges(): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        points: number;
        type: import("@prisma/client").$Enums.BadgeType;
        description: string;
        isActive: boolean;
        iconUrl: string | null;
        criteria: Prisma.JsonValue;
    }[]>;
    getTaliBadges(userId: string): Promise<({
        badge: {
            id: string;
            createdAt: Date;
            name: string;
            points: number;
            type: import("@prisma/client").$Enums.BadgeType;
            description: string;
            isActive: boolean;
            iconUrl: string | null;
            criteria: Prisma.JsonValue;
        };
    } & {
        id: string;
        taliId: string;
        earnedAt: Date;
        badgeId: string;
    })[]>;
    createBadge(data: {
        name: string;
        description: string;
        iconUrl?: string;
        type: BadgeType;
        criteria: BadgeCriteria;
        points?: number;
    }): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        points: number;
        type: import("@prisma/client").$Enums.BadgeType;
        description: string;
        isActive: boolean;
        iconUrl: string | null;
        criteria: Prisma.JsonValue;
    }>;
    updateBadge(id: string, data: Partial<{
        name: string;
        description: string;
        iconUrl: string;
        type: BadgeType;
        criteria: BadgeCriteria;
        points: number;
        isActive: boolean;
    }>): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        points: number;
        type: import("@prisma/client").$Enums.BadgeType;
        description: string;
        isActive: boolean;
        iconUrl: string | null;
        criteria: Prisma.JsonValue;
    }>;
    deleteBadge(id: string): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        points: number;
        type: import("@prisma/client").$Enums.BadgeType;
        description: string;
        isActive: boolean;
        iconUrl: string | null;
        criteria: Prisma.JsonValue;
    }>;
    awardBadge(taliId: string, badgeId: string): Promise<{
        id: string;
        taliId: string;
        earnedAt: Date;
        badgeId: string;
    }>;
    checkAndAwardBadges(taliId: string): Promise<{
        id: string;
        taliId: string;
        earnedAt: Date;
        badgeId: string;
    }[]>;
    getLeaderboard(limit?: number, currentUserId?: string): Promise<{
        rank: number;
        id: string;
        fullName: string;
        email: string;
        points: number;
        currentPoints: number;
        badgeCount: number;
        badges: {
            id: string;
            name: string;
            iconUrl: string | null;
        }[];
        policyCount: number;
        customerCount: number;
        membershipType: import("@prisma/client").$Enums.MembershipType;
        isCurrentUser: boolean;
    }[]>;
    initializeDefaultBadges(): Promise<void>;
}
export {};
