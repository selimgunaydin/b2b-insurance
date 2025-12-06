import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  UseGuards,
  Param,
  Query,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('stats')
  @Roles(Role.ADMIN)
  async getStats() {
    return this.adminService.getDashboardStats();
  }

  @Get('stats/general')
  @Roles(Role.ADMIN)
  async getGeneralStats() {
    return this.adminService.getGeneralTaliStats();
  }

  @Get('financials')
  @Roles(Role.ADMIN)
  async getFinancialStats() {
    return this.adminService.getFinancialStats();
  }

  @Get('financials/liabilities')
  @Roles(Role.ADMIN)
  async getLiabilitiesBreakdown() {
    return this.adminService.getLiabilitiesBreakdown();
  }

  @Get('stats/broadcast')
  @Roles(Role.ADMIN)
  async getBroadcastStats() {
    return this.adminService.getBroadcastStats();
  }

  @Get('stats/tali/:id')
  @Roles(Role.ADMIN)
  async getTaliStats(@Param('id') id: string) {
    return this.adminService.getTaliStats(id);
  }

  @Post('users/:id/points')
  @Roles(Role.ADMIN)
  async managePoints(
    @Param('id') id: string,
    @Body() body: { amount: number; type: string; description: string },
  ) {
    return this.adminService.managePoints(
      id,
      body.amount,
      body.type,
      body.description,
    );
  }

  @Put('users/:id/premium')
  @Roles(Role.ADMIN)
  async upgradeToPremium(@Param('id') id: string) {
    return this.adminService.upgradeToPremium(id);
  }

  // ===== NEW ANALYTICS ENDPOINTS =====

  @Get('analytics')
  @Roles(Role.ADMIN)
  async getConsolidatedAnalytics(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return this.adminService.getConsolidatedAnalytics(start, end);
  }

  @Get('analytics/revenue')
  @Roles(Role.ADMIN)
  async getRevenueByType(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return this.adminService.getRevenueByInsuranceType(start, end);
  }

  @Get('analytics/cancellations')
  @Roles(Role.ADMIN)
  async getCancellationStats(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return this.adminService.getPolicyCancellationRatio(start, end);
  }

  @Put('profit-settings')
  @Roles(Role.ADMIN)
  async updateProfitRates(@Body() body: { rates: Record<string, number> }) {
    return this.adminService.updateProfitRates(body.rates);
  }
}
