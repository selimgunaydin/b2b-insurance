"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InsuranceModule = void 0;
const common_1 = require("@nestjs/common");
const insurance_service_1 = require("./insurance.service");
const insurance_controller_1 = require("./insurance.controller");
const prisma_module_1 = require("../prisma/prisma.module");
const audit_module_1 = require("../audit/audit.module");
const supabase_module_1 = require("../supabase/supabase.module");
let InsuranceModule = class InsuranceModule {
};
exports.InsuranceModule = InsuranceModule;
exports.InsuranceModule = InsuranceModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, audit_module_1.AuditModule, supabase_module_1.SupabaseModule],
        controllers: [insurance_controller_1.InsuranceController],
        providers: [insurance_service_1.InsuranceService],
    })
], InsuranceModule);
//# sourceMappingURL=insurance.module.js.map