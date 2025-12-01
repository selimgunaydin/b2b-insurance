import { PrismaService } from '../prisma/prisma.service';
import { CreatePaymentDto } from './dto/payment.dto';
export declare class PaymentService {
    private prisma;
    constructor(prisma: PrismaService);
    processPayment(dto: CreatePaymentDto): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        points: import("@prisma/client/runtime/library").Decimal;
        type: import("@prisma/client").$Enums.TransactionType;
        description: string | null;
        status: import("@prisma/client").$Enums.TransactionStatus;
    }>;
}
