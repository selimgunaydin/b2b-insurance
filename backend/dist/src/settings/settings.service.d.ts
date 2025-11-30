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
        type: string;
        description: string | null;
        key: string;
        value: string;
        category: string;
    }[]>;
    updateSetting(key: string, value: string, userId: string): Promise<{
        id: string;
        updatedAt: Date;
        type: string;
        description: string | null;
        key: string;
        value: string;
        category: string;
    }>;
}
