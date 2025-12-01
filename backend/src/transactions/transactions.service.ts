import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TransactionsService {
  constructor(private prisma: PrismaService) {}

  async getMyTransactions(userId: string) {
    return this.prisma.transactions.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getUserTransactions(userId: string) {
    return this.prisma.transactions.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async adjustPoints(
    userId: string,
    amount: number,
    type: 'DEPOSIT' | 'REFUND',
    description?: string,
  ) {
    return this.prisma.$transaction(async (prisma) => {
      // 1. Create Transaction
      const transaction = await prisma.transactions.create({
        data: {
          userId,
          points: amount,
          type: type,
          status: 'SUCCESS',
          description,
        },
      });

      // 2. Update Tali Profile Points
      // Find Tali Profile by userId
      const taliProfile = await prisma.taliProfile.findUnique({
        where: { userId },
      });

      if (taliProfile) {
        await prisma.taliProfile.update({
          where: { id: taliProfile.id },
          data: {
            points: {
              increment: amount,
            },
          },
        });
      }

      return transaction;
    });
  }
}
