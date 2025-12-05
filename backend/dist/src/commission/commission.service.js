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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommissionService = void 0;
const common_1 = require("@nestjs/common");
const cache_manager_1 = require("@nestjs/cache-manager");
const prisma_service_1 = require("../prisma/prisma.service");
const CACHE_TTL = 300000;
let CommissionService = class CommissionService {
    prisma;
    cacheManager;
    constructor(prisma, cacheManager) {
        this.prisma = prisma;
        this.cacheManager = cacheManager;
    }
    async getRatesForMembership(membershipType) {
        const cacheKey = `commission_rates_${membershipType}`;
        const cached = await this.cacheManager.get(cacheKey);
        if (cached) {
            return cached;
        }
        const settings = await this.prisma.systemSetting.findMany({
            where: {
                key: { startsWith: `commission_${membershipType}_` },
            },
        });
        const result = settings.map((s) => ({
            insuranceType: s.key.split('_')[2],
            rate: parseFloat(s.value),
        }));
        await this.cacheManager.set(cacheKey, result, CACHE_TTL);
        return result;
    }
    async getAllRates() {
        const cacheKey = 'commission_all_rates';
        const cached = await this.cacheManager.get(cacheKey);
        if (cached) {
            return cached;
        }
        const settings = await this.prisma.systemSetting.findMany({
            where: { category: 'COMMISSION' },
        });
        const result = settings.map((s) => {
            const parts = s.key.split('_');
            return {
                id: s.id,
                key: s.key,
                membershipType: parts[1],
                insuranceType: parts[2],
                rate: parseFloat(s.value),
            };
        });
        await this.cacheManager.set(cacheKey, result, CACHE_TTL);
        return result;
    }
    async updateRate(id, rate) {
        const result = await this.prisma.systemSetting.update({
            where: { id },
            data: { value: rate.toString() },
        });
        await this.cacheManager.del('commission_all_rates');
        await this.cacheManager.del('commission_rates_STANDARD');
        await this.cacheManager.del('commission_rates_PREMIUM');
        return result;
    }
};
exports.CommissionService = CommissionService;
exports.CommissionService = CommissionService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, Object])
], CommissionService);
//# sourceMappingURL=commission.service.js.map