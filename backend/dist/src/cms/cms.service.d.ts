import { PrismaService } from '../prisma/prisma.service';
export declare class CmsService {
    private prisma;
    constructor(prisma: PrismaService);
    getAllContent(): Promise<{
        id: string;
        updatedAt: Date;
        type: string;
        key: string;
        value: string;
        category: string;
    }[]>;
    getContentByCategory(category: string): Promise<{
        id: string;
        updatedAt: Date;
        type: string;
        key: string;
        value: string;
        category: string;
    }[]>;
    getContentByKey(key: string): Promise<{
        id: string;
        updatedAt: Date;
        type: string;
        key: string;
        value: string;
        category: string;
    } | null>;
    upsertContent(key: string, value: string, type: string, category: string): Promise<{
        id: string;
        updatedAt: Date;
        type: string;
        key: string;
        value: string;
        category: string;
    }>;
    deleteContent(key: string): Promise<{
        id: string;
        updatedAt: Date;
        type: string;
        key: string;
        value: string;
        category: string;
    }>;
    initializeDefaults(): Promise<void>;
}
