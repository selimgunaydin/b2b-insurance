import { Module, OnModuleInit, Logger } from '@nestjs/common';
import { BadgeService } from './badge.service';
import { BadgeController } from './badge.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [PrismaModule, NotificationModule],
  controllers: [BadgeController],
  providers: [BadgeService],
  exports: [BadgeService],
})
export class BadgeModule implements OnModuleInit {
  private readonly logger = new Logger(BadgeModule.name);

  constructor(private badgeService: BadgeService) {}

  async onModuleInit() {
    try {
      await this.badgeService.initializeDefaultBadges();
      this.logger.log('Default badges initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize default badges:', error.message);
    }
  }
}

