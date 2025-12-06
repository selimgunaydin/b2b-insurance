import { BadgeService } from './badge.service';
import { BadgeType } from '@prisma/client';
export declare class BadgeController {
    private readonly badgeService;
    constructor(badgeService: BadgeService);
    getAllBadges(): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        points: number;
        type: import("@prisma/client").$Enums.BadgeType;
        description: string;
        iconUrl: string | null;
        criteria: import("@prisma/client/runtime/library").JsonValue;
        isActive: boolean;
    }[]>;
    getLeaderboard(limit?: string, req?: any): Promise<{
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
    getMyBadges(req: any): Promise<({
        badge: {
            id: string;
            createdAt: Date;
            name: string;
            points: number;
            type: import("@prisma/client").$Enums.BadgeType;
            description: string;
            iconUrl: string | null;
            criteria: import("@prisma/client/runtime/library").JsonValue;
            isActive: boolean;
        };
    } & {
        id: string;
        taliId: string;
        badgeId: string;
        earnedAt: Date;
    })[]>;
    getUserBadges(userId: string): Promise<({
        badge: {
            id: string;
            createdAt: Date;
            name: string;
            points: number;
            type: import("@prisma/client").$Enums.BadgeType;
            description: string;
            iconUrl: string | null;
            criteria: import("@prisma/client/runtime/library").JsonValue;
            isActive: boolean;
        };
    } & {
        id: string;
        taliId: string;
        badgeId: string;
        earnedAt: Date;
    })[]>;
    createBadge(body: {
        name: string;
        description: string;
        iconUrl?: string;
        type: BadgeType;
        criteria: {
            threshold: number;
            insuranceType?: string;
        };
        points?: number;
    }): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        points: number;
        type: import("@prisma/client").$Enums.BadgeType;
        description: string;
        iconUrl: string | null;
        criteria: import("@prisma/client/runtime/library").JsonValue;
        isActive: boolean;
    }>;
    updateBadge(id: string, body: {
        name?: string;
        description?: string;
        iconUrl?: string;
        type?: BadgeType;
        criteria?: {
            threshold: number;
            insuranceType?: string;
        };
        points?: number;
        isActive?: boolean;
    }): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        points: number;
        type: import("@prisma/client").$Enums.BadgeType;
        description: string;
        iconUrl: string | null;
        criteria: import("@prisma/client/runtime/library").JsonValue;
        isActive: boolean;
    }>;
    deleteBadge(id: string): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        points: number;
        type: import("@prisma/client").$Enums.BadgeType;
        description: string;
        iconUrl: string | null;
        criteria: import("@prisma/client/runtime/library").JsonValue;
        isActive: boolean;
    }>;
    awardBadge(taliId: string, badgeId: string): Promise<{
        id: string;
        taliId: string;
        badgeId: string;
        earnedAt: Date;
    }>;
    checkAndAwardBadges(taliId: string): Promise<{
        id: string;
        taliId: string;
        badgeId: string;
        earnedAt: Date;
    }[]>;
    initializeDefaultBadges(): Promise<{
        message: string;
    }>;
}
