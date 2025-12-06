import type { Response } from 'express';
export declare class LoggerController {
    downloadLog(startDate: string, endDate: string, res: Response): Promise<void>;
    listLogs(): Promise<{
        timestamp: any;
        level: any;
        message: any;
        context: any;
    }[]>;
}
