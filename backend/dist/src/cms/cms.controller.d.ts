import { CmsService } from './cms.service';
export declare class CmsController {
    private readonly cmsService;
    constructor(cmsService: CmsService);
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
    upsertContent(body: {
        key: string;
        value: string;
        type: string;
        category: string;
    }): Promise<{
        id: string;
        updatedAt: Date;
        key: string;
        value: string;
        type: string;
        category: string;
    }>;
    deleteContent(key: string): Promise<{
        id: string;
        updatedAt: Date;
        key: string;
        value: string;
        type: string;
        category: string;
    }>;
    initializeDefaults(): Promise<{
        message: string;
    }>;
}
