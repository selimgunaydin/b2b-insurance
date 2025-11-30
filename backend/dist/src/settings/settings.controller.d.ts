import { SettingsService } from './settings.service';
export declare class SettingsController {
    private readonly settingsService;
    constructor(settingsService: SettingsService);
    getPublicConfig(): Promise<{
        id: string;
        key: string;
        value: string;
        type: string;
        category: string;
        description: string | null;
        updatedAt: Date;
    }[]>;
    getSettings(): Promise<{
        id: string;
        key: string;
        value: string;
        type: string;
        category: string;
        description: string | null;
        updatedAt: Date;
    }[]>;
    getConfig(): Promise<{
        id: string;
        key: string;
        value: string;
        type: string;
        category: string;
        description: string | null;
        updatedAt: Date;
    }[]>;
    updateSetting(key: string, value: string, req: any): Promise<{
        id: string;
        key: string;
        value: string;
        type: string;
        category: string;
        description: string | null;
        updatedAt: Date;
    }>;
}
