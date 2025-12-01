import { PrismaService } from '../prisma/prisma.service';
export declare class TransactionsService {
    private prisma;
    constructor(prisma: PrismaService);
    getMyTransactions(userId: string): Promise<{
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
    adjustPoints(userId: string, amount: number, type: 'DEPOSIT' | 'REFUND', description?: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        points: import("@prisma/client/runtime/library").Decimal;
        type: import("@prisma/client").$Enums.TransactionType;
        description: string | null;
        status: import("@prisma/client").$Enums.TransactionStatus;
    }>;
}
