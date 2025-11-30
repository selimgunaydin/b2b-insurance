import {
  Controller,
  Get,
  UseGuards,
  Request,
  Put,
  Param,
  Body,
} from '@nestjs/common';
import { CommissionService } from './commission.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';

@Controller('commission')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CommissionController {
  constructor(private readonly commissionService: CommissionService) {}

  @Get('my-rates')
  @Roles(Role.TALI)
  async getMyRates(@Request() req: any) {
    const user = await this.commissionService['prisma'].user.findUnique({
      where: { id: req.user.id },
      include: { taliProfile: true },
    });

    if (!user || !user.taliProfile) {
      throw new Error('Tali profile not found');
    }

    return this.commissionService.getRatesForMembership(
      user.taliProfile.membershipType,
    );
  }

  @Get('all')
  @Roles(Role.ADMIN)
  async getAllRates() {
    return this.commissionService.getAllRates();
  }

  @Put(':id')
  @Roles(Role.ADMIN)
  async updateRate(@Param('id') id: string, @Body('rate') rate: number) {
    return this.commissionService.updateRate(id, rate);
  }
}
