import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/payment.dto';
export declare class PaymentController {
    private readonly paymentService;
    constructor(paymentService: PaymentService);
    create(createPaymentDto: CreatePaymentDto): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        points: import("@prisma/client/runtime/library").Decimal;
        type: import("@prisma/client").$Enums.TransactionType;
        description: string | null;
        status: import("@prisma/client").$Enums.TransactionStatus;
    }>;
}
