import { Module } from '@nestjs/common';
import { InsuranceService } from './insurance.service';
import { InsuranceController } from './insurance.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AuditModule } from '../audit/audit.module';
import { SupabaseModule } from '../supabase/supabase.module';

import { NotificationModule } from '../notification/notification.module';
import { GoalModule } from '../goal/goal.module';
import { WhatsAppModule } from '../whatsapp/whatsapp.module';
import { PaymentModule } from '../payment/payment.module';
import { UserModule } from '../user/user.module';
import { OcrModule } from '../ocr/ocr.module';

@Module({
  imports: [
    PrismaModule,
    AuditModule,
    SupabaseModule,
    NotificationModule,
    GoalModule,
    WhatsAppModule,
    PaymentModule,
    UserModule,
    OcrModule,
  ],
  controllers: [InsuranceController],
  providers: [InsuranceService],
})
export class InsuranceModule {}
