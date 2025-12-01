import { Controller, Get, Post, Put, Body, UseGuards, Param } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) { }

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
}
