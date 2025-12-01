import { TransactionsService } from './transactions.service';
export declare class TransactionsController {
    private readonly transactionsService;
    constructor(transactionsService: TransactionsService);
    getMyTransactions(req: any): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        points: import("@prisma/client/runtime/library").Decimal;
        type: import("@prisma/client").$Enums.TransactionType;
        description: string | null;
        status: import("@prisma/client").$Enums.TransactionStatus;
    }[]>;
    getUserTransactions(userId: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        points: import("@prisma/client/runtime/library").Decimal;
        type: import("@prisma/client").$Enums.TransactionType;
        description: string | null;
        status: import("@prisma/client").$Enums.TransactionStatus;
    }[]>;
    adjustPoints(body: {
        userId: string;
        amount: number;
        type: 'DEPOSIT' | 'REFUND';
        description?: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        points: import("@prisma/client/runtime/library").Decimal;
        type: import("@prisma/client").$Enums.TransactionType;
        description: string | null;
        status: import("@prisma/client").$Enums.TransactionStatus;
    }>;
}
