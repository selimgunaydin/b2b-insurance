import { Module } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { SettingsController } from './settings.controller';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';

@Module({
  controllers: [SettingsController],
  providers: [SettingsService, PrismaService, AuditService],
  exports: [SettingsService],
})
export class SettingsModule {}
