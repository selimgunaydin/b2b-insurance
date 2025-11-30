import { TransactionType } from '@prisma/client';
export declare class CreatePaymentDto {
    userId: string;
    amount: number;
    type: TransactionType;
}
