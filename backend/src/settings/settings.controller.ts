import {
  Controller,
  Get,
  Put,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { SettingsService } from './settings.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) { }

  @Get('public-config')
  async getPublicConfig() {
    const settings = await this.settingsService.getSettings();
    // Filter only public settings
    return settings.filter((s) =>
      ['maintenance_mode', 'site_title', 'allow_new_registration'].includes(
        s.key,
      ),
    );
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.TALI)
  async getSettings() {
    return this.settingsService.getSettings();
  }

  @Get('config')
  async getConfig() {
    const settings = await this.settingsService.getSettings();
    // Filter only safe settings
    return settings.filter(
      (s) => s.key.startsWith('insurance_type_') && s.key.endsWith('_enabled'),
    );
  }

  @Put(':key')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async updateSetting(
    @Param('key') key: string,
    @Body('value') value: string,
    @Request() req: any,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return this.settingsService.updateSetting(key, value, req.user.id);
  }
}
