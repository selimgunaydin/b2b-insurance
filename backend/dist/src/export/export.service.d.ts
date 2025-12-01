import { PrismaService } from '../prisma/prisma.service';
import { Response } from 'express';
export declare class ExportService {
    private prisma;
    constructor(prisma: PrismaService);
    exportUsers(res: Response): Promise<void>;
    exportCustomers(res: Response): Promise<void>;
    exportPolicies(res: Response): Promise<void>;
    exportOffers(res: Response): Promise<void>;
}
