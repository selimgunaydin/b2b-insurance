import { PrismaService } from '../prisma/prisma.service';
export declare class CommissionService {
    private prisma;
    constructor(prisma: PrismaService);
    getRatesForMembership(membershipType: string): Promise<{
        insuranceType: string;
        rate: number;
    }[]>;
    getAllRates(): Promise<{
        id: string;
        updatedAt: Date;
        key: string;
        value: string;
        type: string;
        category: string;
        description: string | null;
    }[]>;
    updateRate(key: string, rate: number): Promise<{
        id: string;
        updatedAt: Date;
        key: string;
        value: string;
        type: string;
        category: string;
        description: string | null;
    }>;
}
