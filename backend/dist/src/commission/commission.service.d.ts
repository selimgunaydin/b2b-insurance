import type { Cache } from 'cache-manager';
import { PrismaService } from '../prisma/prisma.service';
export declare class CommissionService {
    private prisma;
    private cacheManager;
    constructor(prisma: PrismaService, cacheManager: Cache);
    getRatesForMembership(membershipType: string): Promise<{}>;
    getAllRates(): Promise<{}>;
    updateRate(id: string, rate: number): Promise<{
        id: string;
        updatedAt: Date;
        key: string;
        value: string;
        type: string;
        category: string;
        description: string | null;
    }>;
}
