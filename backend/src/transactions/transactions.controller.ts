import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
  Param,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';

@Controller('transactions')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get('my-transactions')
  @Roles(Role.TALI)
  async getMyTransactions(@Request() req: any) {
    return this.transactionsService.getMyTransactions(req.user.id);
  }

  @Get('user/:userId')
  @Roles(Role.ADMIN)
  async getUserTransactions(@Param('userId') userId: string) {
    return this.transactionsService.getUserTransactions(userId);
  }

  @Post('adjust')
  @Roles(Role.ADMIN)
  async adjustPoints(
    @Body()
    body: {
      userId: string;
      amount: number;
      type: 'DEPOSIT' | 'REFUND';
      description?: string;
    },
  ) {
    return this.transactionsService.adjustPoints(
      body.userId,
      body.amount,
      body.type,
      body.description,
    );
  }
}
