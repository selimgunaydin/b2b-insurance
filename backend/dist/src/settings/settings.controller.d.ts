import { SettingsService } from './settings.service';
export declare class SettingsController {
    private readonly settingsService;
    constructor(settingsService: SettingsService);
    getSettings(): Promise<{
        id: string;
        updatedAt: Date;
        key: string;
        value: string;
        type: string;
        category: string;
        description: string | null;
    }[]>;
    getConfig(): Promise<{
        id: string;
        updatedAt: Date;
        key: string;
        value: string;
        type: string;
        category: string;
        description: string | null;
    }[]>;
    updateSetting(key: string, body: {
        value: string;
    }, req: any): Promise<{
        id: string;
        updatedAt: Date;
        key: string;
        value: string;
        type: string;
        category: string;
        description: string | null;
    }>;
}
