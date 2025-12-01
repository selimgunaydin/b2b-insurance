import { Controller, Get, Res, UseGuards } from '@nestjs/common';
import { ExportService } from './export.service';
import type { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';

@Controller('export')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(Role.ADMIN)
export class ExportController {
  constructor(private readonly exportService: ExportService) {}

  @Get('users')
  async exportUsers(@Res() res: Response) {
    return this.exportService.exportUsers(res);
  }

  @Get('customers')
  async exportCustomers(@Res() res: Response) {
    return this.exportService.exportCustomers(res);
  }

  @Get('policies')
  async exportPolicies(@Res() res: Response) {
    return this.exportService.exportPolicies(res);
  }

  @Get('offers')
  async exportOffers(@Res() res: Response) {
    return this.exportService.exportOffers(res);
  }
}
