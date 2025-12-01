import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { PremiumService } from './premium.service';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';

@Controller('premium')
export class PremiumController {
  constructor(private readonly premiumService: PremiumService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('request')
  async createRequest(
    @Request() req: any,
    @Body() body: { paymentMethod: string },
  ) {
    return this.premiumService.createRequest(req.user.id, body.paymentMethod);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get('requests')
  async findAllRequests() {
    return this.premiumService.findAllRequests();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Put('requests/:id/approve')
  async approveRequest(@Param('id') id: string) {
    return this.premiumService.approveRequest(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Put('requests/:id/reject')
  async rejectRequest(@Param('id') id: string) {
    return this.premiumService.rejectRequest(id);
  }
}
