import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TransactionsService {
    constructor(private prisma: PrismaService) { }

    async getMyTransactions(userId: string) {
        return this.prisma.transactions.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    }
}
