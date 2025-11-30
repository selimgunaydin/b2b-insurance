import { PrismaService } from '../prisma/prisma.service';
import { CreatePaymentDto } from './dto/payment.dto';
export declare class PaymentService {
    private prisma;
    constructor(prisma: PrismaService);
    processPayment(dto: CreatePaymentDto): Promise<{
        id: string;
        createdAt: Date;
        type: import("@prisma/client").$Enums.TransactionType;
        points: import("@prisma/client/runtime/library").Decimal;
        userId: string;
        status: import("@prisma/client").$Enums.TransactionStatus;
    }>;
}
