import { PrismaService } from '../prisma/prisma.service';
export declare class CmsService {
    private prisma;
    constructor(prisma: PrismaService);
    getAllContent(): Promise<{
        id: string;
        updatedAt: Date;
        key: string;
        value: string;
        type: string;
        category: string;
    }[]>;
    getContentByCategory(category: string): Promise<{
        id: string;
        updatedAt: Date;
        key: string;
        value: string;
        type: string;
        category: string;
    }[]>;
    getContentByKey(key: string): Promise<{
        id: string;
        updatedAt: Date;
        key: string;
        value: string;
        type: string;
        category: string;
    } | null>;
    getMultipleByKeys(keys: string[]): Promise<{
        id: string;
        updatedAt: Date;
        key: string;
        value: string;
        type: string;
        category: string;
    }[]>;
    upsertContent(key: string, value: string, type: string, category: string): Promise<{
        id: string;
        updatedAt: Date;
        key: string;
        value: string;
        type: string;
        category: string;
    }>;
    bulkUpsert(items: Array<{
        key: string;
        value: string;
        type: string;
        category: string;
    }>): Promise<{
        id: string;
        updatedAt: Date;
        key: string;
        value: string;
        type: string;
        category: string;
    }[]>;
    deleteContent(key: string): Promise<{
        id: string;
        updatedAt: Date;
        key: string;
        value: string;
        type: string;
        category: string;
    }>;
    initializeDefaults(): Promise<void>;
}
