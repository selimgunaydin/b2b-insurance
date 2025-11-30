"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommissionService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let CommissionService = class CommissionService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getRatesForMembership(membershipType) {
        const settings = await this.prisma.systemSetting.findMany({
            where: {
                key: { startsWith: `commission_${membershipType}_` },
            },
        });
        return settings.map((s) => ({
            insuranceType: s.key.split('_')[2],
            rate: parseFloat(s.value),
        }));
    }
    async getAllRates() {
        const settings = await this.prisma.systemSetting.findMany({
            where: { category: 'COMMISSION' },
        });
        return settings;
    }
    async updateRate(key, rate) {
        return this.prisma.systemSetting.update({
            where: { key },
            data: { value: rate.toString() },
        });
    }
};
exports.CommissionService = CommissionService;
exports.CommissionService = CommissionService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CommissionService);
//# sourceMappingURL=commission.service.js.map