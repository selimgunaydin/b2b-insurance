import { IsEnum, IsNumber, IsString, IsUUID } from 'class-validator';
import { TransactionType } from '@prisma/client';

export class CreatePaymentDto {
  @IsUUID()
  userId: string;

  @IsNumber()
  amount: number;

  @IsEnum(TransactionType)
  type: TransactionType;
}
