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
        isActive: boolean;
        iconUrl: string | null;
        criteria: import("@prisma/client/runtime/library").JsonValue;
    }[]>;
    getLeaderboard(limit?: string): Promise<{
        rank: number;
        id: string;
        fullName: string;
        email: string;
        points: number;
        badgeCount: number;
        badges: {
            id: string;
            name: string;
            iconUrl: string | null;
        }[];
        policyCount: number;
        customerCount: number;
        membershipType: import("@prisma/client").$Enums.MembershipType;
    }[]>;
    getMyBadges(req: any): Promise<({
        badge: {
            id: string;
            createdAt: Date;
            name: string;
            points: number;
            type: import("@prisma/client").$Enums.BadgeType;
            description: string;
            isActive: boolean;
            iconUrl: string | null;
            criteria: import("@prisma/client/runtime/library").JsonValue;
        };
    } & {
        id: string;
        taliId: string;
        earnedAt: Date;
        badgeId: string;
    })[]>;
    getUserBadges(userId: string): Promise<({
        badge: {
            id: string;
            createdAt: Date;
            name: string;
            points: number;
            type: import("@prisma/client").$Enums.BadgeType;
            description: string;
            isActive: boolean;
            iconUrl: string | null;
            criteria: import("@prisma/client/runtime/library").JsonValue;
        };
    } & {
        id: string;
        taliId: string;
        earnedAt: Date;
        badgeId: string;
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
        isActive: boolean;
        iconUrl: string | null;
        criteria: import("@prisma/client/runtime/library").JsonValue;
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
        isActive: boolean;
        iconUrl: string | null;
        criteria: import("@prisma/client/runtime/library").JsonValue;
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
        criteria: import("@prisma/client/runtime/library").JsonValue;
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
    initializeDefaultBadges(): Promise<{
        message: string;
    }>;
}
