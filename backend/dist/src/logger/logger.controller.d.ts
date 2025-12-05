import type { Response } from 'express';
export declare class LoggerController {
    downloadLog(date: string, res: Response): Promise<void>;
    listLogs(): Promise<any[]>;
}
