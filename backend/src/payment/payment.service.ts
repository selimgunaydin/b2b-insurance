import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePaymentDto } from './dto/payment.dto';
import { TransactionStatus } from '@prisma/client';

@Injectable()
export class PaymentService {
  constructor(private prisma: PrismaService) { }

  async processPayment(dto: CreatePaymentDto) {
    // Mock payment processing logic here (e.g. call Iyzico/Stripe)

    // Create transaction record
    const transaction = await this.prisma.transactions.create({
      data: {
        userId: dto.userId,
        points: dto.amount,
        type: dto.type,
        status: TransactionStatus.SUCCESS, // Assuming success for mock
      },
    });

    // Update user points (in TaliProfile)
    if (dto.type === 'DEPOSIT' || dto.type === 'COMMISSION') {
      await this.prisma.taliProfile.update({
        where: { userId: dto.userId },
        data: { points: { increment: dto.amount } },
      });
    } else if (dto.type === 'PAYMENT' || dto.type === 'REFUND' || dto.type === 'MARKET_PURCHASE') {
      await this.prisma.taliProfile.update({
        where: { userId: dto.userId },
        data: { points: { decrement: dto.amount } },
      });
    }

    return transaction;
  }
}
