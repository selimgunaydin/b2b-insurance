import { ExportService } from './export.service';
import type { Response } from 'express';
export declare class ExportController {
    private readonly exportService;
    constructor(exportService: ExportService);
    exportUsers(res: Response): Promise<void>;
    exportCustomers(res: Response): Promise<void>;
    exportPolicies(res: Response): Promise<void>;
    exportOffers(res: Response): Promise<void>;
}
