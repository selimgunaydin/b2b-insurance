import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/payment.dto';
export declare class PaymentController {
    private readonly paymentService;
    constructor(paymentService: PaymentService);
    create(createPaymentDto: CreatePaymentDto): Promise<{
        id: string;
        createdAt: Date;
        type: import("@prisma/client").$Enums.TransactionType;
        points: import("@prisma/client/runtime/library").Decimal;
        userId: string;
        status: import("@prisma/client").$Enums.TransactionStatus;
    }>;
}
