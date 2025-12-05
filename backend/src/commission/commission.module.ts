import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { CommissionService } from './commission.service';
import { CommissionController } from './commission.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    CacheModule.register({
      ttl: 300000, // 5 minutes default TTL
    }),
  ],
  controllers: [CommissionController],
  providers: [CommissionService],
  exports: [CommissionService],
})
export class CommissionModule {}

