import { OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
export declare class SettingsService implements OnModuleInit {
    private prisma;
    private auditService;
    constructor(prisma: PrismaService, auditService: AuditService);
    onModuleInit(): Promise<void>;
    initializeDefaultSettings(): Promise<void>;
    getSettings(): Promise<{
        id: string;
        updatedAt: Date;
        key: string;
        value: string;
        type: string;
        category: string;
        description: string | null;
    }[]>;
    updateSetting(key: string, value: string, userId: string): Promise<{
        id: string;
        updatedAt: Date;
        key: string;
        value: string;
        type: string;
        category: string;
        description: string | null;
    }>;
    getTrustRestrictionsForUser(userId: string): Promise<{
        trustScoreEnabled: boolean;
        userTrustScore: number;
        restrictions: {
            type: string;
            allowed: boolean;
            reason: string | null;
            minRequired: number;
        }[];
    }>;
}
