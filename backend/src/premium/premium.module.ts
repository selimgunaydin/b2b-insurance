import { Module } from '@nestjs/common';
import { PremiumService } from './premium.service';
import { PremiumController } from './premium.controller';
import { PrismaModule } from '../prisma/prisma.module';

import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [PrismaModule, NotificationModule],
  controllers: [PremiumController],
  providers: [PremiumService],
})
export class PremiumModule { }
