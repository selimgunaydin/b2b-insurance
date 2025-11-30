import { CommissionService } from './commission.service';
export declare class CommissionController {
    private readonly commissionService;
    constructor(commissionService: CommissionService);
    getMyRates(req: any): Promise<{
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
