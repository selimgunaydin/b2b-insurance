import { SettingsService } from './settings.service';
export declare class SettingsController {
    private readonly settingsService;
    constructor(settingsService: SettingsService);
    getPublicConfig(): Promise<{
        id: string;
        updatedAt: Date;
        key: string;
        value: string;
        type: string;
        category: string;
        description: string | null;
    }[]>;
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
    getTrustRestrictions(req: any): Promise<{
        trustScoreEnabled: boolean;
        userTrustScore: number;
        restrictions: {
            type: string;
            allowed: boolean;
            reason: string | null;
            minRequired: number;
        }[];
    }>;
    updateSetting(key: string, value: string, req: any): Promise<{
        id: string;
        updatedAt: Date;
        key: string;
        value: string;
        type: string;
        category: string;
        description: string | null;
    }>;
}
