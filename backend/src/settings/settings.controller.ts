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
@UseGuards(JwtAuthGuard, RolesGuard)
export class SettingsController {
    constructor(private readonly settingsService: SettingsService) { }

    @Get()
    @Roles(Role.ADMIN)
    async getSettings() {
        return this.settingsService.getSettings();
    }

    @Get('config')
    async getConfig() {
        const settings = await this.settingsService.getSettings();
        // Filter only safe settings
        return settings.filter(s => s.key.startsWith('insurance_type_') && s.key.endsWith('_enabled'));
    }

    @Put(':key')
    @Roles(Role.ADMIN)
    async updateSetting(
        @Param('key') key: string,
        @Body() body: { value: string },
        @Request() req: any,
    ) {
        return this.settingsService.updateSetting(key, body.value, req.user.id);
    }
}
