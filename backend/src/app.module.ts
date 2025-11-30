import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
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

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
