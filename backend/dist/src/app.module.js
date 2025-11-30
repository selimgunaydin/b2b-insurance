"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const config_1 = require("@nestjs/config");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const prisma_module_1 = require("./prisma/prisma.module");
const auth_module_1 = require("./auth/auth.module");
const user_module_1 = require("./user/user.module");
const insurance_module_1 = require("./insurance/insurance.module");
const payment_module_1 = require("./payment/payment.module");
const cancellation_module_1 = require("./cancellation/cancellation.module");
const notification_module_1 = require("./notification/notification.module");
const audit_module_1 = require("./audit/audit.module");
const commission_module_1 = require("./commission/commission.module");
const supabase_module_1 = require("./supabase/supabase.module");
const chat_module_1 = require("./chat/chat.module");
const settings_module_1 = require("./settings/settings.module");
const admin_module_1 = require("./admin/admin.module");
const company_module_1 = require("./company/company.module");
const upload_module_1 = require("./upload/upload.module");
const goal_module_1 = require("./goal/goal.module");
const cms_module_1 = require("./cms/cms.module");
const market_module_1 = require("./market/market.module");
const premium_module_1 = require("./premium/premium.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            user_module_1.UserModule,
            insurance_module_1.InsuranceModule,
            payment_module_1.PaymentModule,
            cancellation_module_1.CancellationModule,
            notification_module_1.NotificationModule,
            commission_module_1.CommissionModule,
            audit_module_1.AuditModule,
            supabase_module_1.SupabaseModule,
            chat_module_1.ChatModule,
            settings_module_1.SettingsModule,
            admin_module_1.AdminModule,
            company_module_1.CompanyModule,
            upload_module_1.UploadModule,
            schedule_1.ScheduleModule.forRoot(),
            goal_module_1.GoalModule,
            cms_module_1.CmsModule,
            market_module_1.MarketModule,
            premium_module_1.PremiumModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map