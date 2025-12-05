import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { InsuranceModule } from './insurance/insurance.module';
import { PaymentModule } from './payment/payment.module';
import { CancellationModule } from './cancellation/cancellation.module';
import { NotificationModule } from './notification/notification.module';
import { AuditModule } from './audit/audit.module';

import { CommissionModule } from './commission/commission.module';
import { SupabaseModule } from './supabase/supabase.module';
import { ChatModule } from './chat/chat.module';
import { SettingsModule } from './settings/settings.module';
import { AdminModule } from './admin/admin.module';
import { CompanyModule } from './company/company.module';
import { UploadModule } from './upload/upload.module';

import { GoalModule } from './goal/goal.module';
import { CmsModule } from './cms/cms.module';
import { MarketModule } from './market/market.module';
import { PremiumModule } from './premium/premium.module';
import { TransactionsModule } from './transactions/transactions.module';
import { ExportModule } from './export/export.module';
import { OcrModule } from './ocr/ocr.module';
import { BadgeModule } from './badge/badge.module';
import { EmailModule } from './email/email.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    // Rate limiting - 100 requests per minute globally
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000, // 1 second
        limit: 5,  // 5 requests per second
      },
      {
        name: 'medium',
        ttl: 10000, // 10 seconds
        limit: 30,  // 30 requests per 10 seconds
      },
      {
        name: 'long',
        ttl: 60000, // 1 minute
        limit: 100, // 100 requests per minute
      },
    ]),
    PrismaModule,
    AuthModule,
    UserModule,
    InsuranceModule,
    PaymentModule,
    CancellationModule,
    NotificationModule,
    CommissionModule,
    AuditModule,
    SupabaseModule,
    ChatModule,
    SettingsModule,
    AdminModule,
    CompanyModule,
    UploadModule,
    ScheduleModule.forRoot(),
    GoalModule,
    CmsModule,
    MarketModule,
    PremiumModule,
    TransactionsModule,
    ExportModule,
    OcrModule,
    BadgeModule,
    EmailModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
