import { Module } from '@nestjs/common';
import { MarketController } from './market.controller';
import { MarketService } from './market.service';
import { PrismaModule } from '../prisma/prisma.module';

import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [PrismaModule, NotificationModule],
  controllers: [MarketController],
  providers: [MarketService],
})
export class MarketModule { }
