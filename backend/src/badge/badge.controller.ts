import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { BadgeService } from './badge.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role, BadgeType } from '@prisma/client';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('Badges')
@Controller('badges')
export class BadgeController {
  constructor(private readonly badgeService: BadgeService) {}

  @Get()
  @ApiOperation({ summary: 'Get all badges' })
  async getAllBadges() {
    return this.badgeService.getAllBadges();
  }

  @Get('leaderboard')
  @ApiOperation({ summary: 'Get leaderboard' })
  async getLeaderboard(@Query('limit') limit?: string) {
    return this.badgeService.getLeaderboard(limit ? parseInt(limit) : 10);
  }

  @Get('my')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get my badges' })
  async getMyBadges(@Request() req: any) {
    return this.badgeService.getTaliBadges(req.user.id);
  }

  @Get('user/:userId')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get badges for a specific user (admin only)' })
  async getUserBadges(@Param('userId') userId: string) {
    return this.badgeService.getTaliBadges(userId);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create a new badge (admin only)' })
  async createBadge(
    @Body()
    body: {
      name: string;
      description: string;
      iconUrl?: string;
      type: BadgeType;
      criteria: { threshold: number; insuranceType?: string };
      points?: number;
    },
  ) {
    return this.badgeService.createBadge(body);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update a badge (admin only)' })
  async updateBadge(
    @Param('id') id: string,
    @Body()
    body: {
      name?: string;
      description?: string;
      iconUrl?: string;
      type?: BadgeType;
      criteria?: { threshold: number; insuranceType?: string };
      points?: number;
      isActive?: boolean;
    },
  ) {
    return this.badgeService.updateBadge(id, body);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete a badge (admin only)' })
  async deleteBadge(@Param('id') id: string) {
    return this.badgeService.deleteBadge(id);
  }

  @Post('award/:taliId/:badgeId')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Award a badge to a tali (admin only)' })
  async awardBadge(
    @Param('taliId') taliId: string,
    @Param('badgeId') badgeId: string,
  ) {
    return this.badgeService.awardBadge(taliId, badgeId);
  }

  @Post('check/:taliId')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Check and award eligible badges to a tali (admin only)',
  })
  async checkAndAwardBadges(@Param('taliId') taliId: string) {
    return this.badgeService.checkAndAwardBadges(taliId);
  }

  @Post('initialize')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Initialize default badges (admin only)' })
  async initializeDefaultBadges() {
    await this.badgeService.initializeDefaultBadges();
    return { message: 'Default badges initialized' };
  }
}
