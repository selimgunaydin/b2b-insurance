import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';

@Controller('transactions')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TransactionsController {
    constructor(private readonly transactionsService: TransactionsService) { }

    @Get('my-transactions')
    @Roles(Role.TALI)
    async getMyTransactions(@Request() req: any) {
        return this.transactionsService.getMyTransactions(req.user.id);
    }
}
