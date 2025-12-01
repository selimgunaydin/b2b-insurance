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
        status: import("@prisma/client").$Enums.TransactionStatus;
    }[]>;
}
