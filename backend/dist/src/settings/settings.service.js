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
exports.SettingsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const audit_service_1 = require("../audit/audit.service");
let SettingsService = class SettingsService {
    prisma;
    auditService;
    constructor(prisma, auditService) {
        this.prisma = prisma;
        this.auditService = auditService;
    }
    async onModuleInit() {
        await this.initializeDefaultSettings();
    }
    async initializeDefaultSettings() {
        const defaults = [
            {
                key: 'site_title',
                value: 'B2B Sigorta Paneli',
                type: 'TEXT',
                category: 'GENERAL',
                description: 'Site başlığı',
            },
            {
                key: 'maintenance_mode',
                value: 'false',
                type: 'BOOLEAN',
                category: 'GENERAL',
                description: 'Bakım modu aktif mi?',
            },
            {
                key: 'allow_new_registration',
                value: 'true',
                type: 'BOOLEAN',
                category: 'GENERAL',
                description: 'Yeni üye alımı açık mı?',
            },
            {
                key: 'insurance_type_TRAFIK_enabled',
                value: 'true',
                type: 'BOOLEAN',
                category: 'GENERAL',
                description: 'Trafik Sigortası Aktif mi?',
            },
            {
                key: 'insurance_type_KASKO_enabled',
                value: 'true',
                type: 'BOOLEAN',
                category: 'GENERAL',
                description: 'Kasko Sigortası Aktif mi?',
            },
            {
                key: 'insurance_type_SAGLIK_enabled',
                value: 'true',
                type: 'BOOLEAN',
                category: 'GENERAL',
                description: 'Sağlık Sigortası Aktif mi?',
            },
            {
                key: 'insurance_type_DASK_enabled',
                value: 'true',
                type: 'BOOLEAN',
                category: 'GENERAL',
                description: 'DASK Sigortası Aktif mi?',
            },
            {
                key: 'insurance_type_KONUT_enabled',
                value: 'true',
                type: 'BOOLEAN',
                category: 'GENERAL',
                description: 'Konut Sigortası Aktif mi?',
            },
            {
                key: 'commission_STANDARD_TRAFIK',
                value: '5',
                type: 'NUMBER',
                category: 'COMMISSION',
                description: 'Standart - Trafik Komisyonu (%)',
            },
            {
                key: 'commission_STANDARD_KASKO',
                value: '10',
                type: 'NUMBER',
                category: 'COMMISSION',
                description: 'Standart - Kasko Komisyonu (%)',
            },
            {
                key: 'commission_STANDARD_SAGLIK',
                value: '10',
                type: 'NUMBER',
                category: 'COMMISSION',
                description: 'Standart - Sağlık Komisyonu (%)',
            },
            {
                key: 'commission_STANDARD_DASK',
                value: '8',
                type: 'NUMBER',
                category: 'COMMISSION',
                description: 'Standart - DASK Komisyonu (%)',
            },
            {
                key: 'commission_STANDARD_KONUT',
                value: '12',
                type: 'NUMBER',
                category: 'COMMISSION',
                description: 'Standart - Konut Komisyonu (%)',
            },
            {
                key: 'commission_PREMIUM_TRAFIK',
                value: '8',
                type: 'NUMBER',
                category: 'COMMISSION',
                description: 'Premium - Trafik Komisyonu (%)',
            },
            {
                key: 'commission_PREMIUM_KASKO',
                value: '15',
                type: 'NUMBER',
                category: 'COMMISSION',
                description: 'Premium - Kasko Komisyonu (%)',
            },
            {
                key: 'commission_PREMIUM_SAGLIK',
                value: '15',
                type: 'NUMBER',
                category: 'COMMISSION',
                description: 'Premium - Sağlık Komisyonu (%)',
            },
            {
                key: 'commission_PREMIUM_DASK',
                value: '12',
                type: 'NUMBER',
                category: 'COMMISSION',
                description: 'Premium - DASK Komisyonu (%)',
            },
            {
                key: 'commission_PREMIUM_KONUT',
                value: '18',
                type: 'NUMBER',
                category: 'COMMISSION',
                description: 'Premium - Konut Komisyonu (%)',
            },
            {
                key: 'email_notifications',
                value: 'true',
                type: 'BOOLEAN',
                category: 'NOTIFICATIONS',
                description: 'E-posta bildirimleri açık mı?',
            },
            {
                key: 'whatsapp_enabled',
                value: 'false',
                type: 'BOOLEAN',
                category: 'NOTIFICATIONS',
                description: 'WhatsApp bildirimleri aktif mi?',
            },
            {
                key: 'whatsapp_api_key',
                value: '',
                type: 'TEXT',
                category: 'NOTIFICATIONS',
                description: 'WhatsApp API Anahtarı (Twilio)',
            },
            {
                key: 'whatsapp_sender_number',
                value: '',
                type: 'TEXT',
                category: 'NOTIFICATIONS',
                description: 'WhatsApp Gönderici Numarası',
            },
        ];
        for (const setting of defaults) {
            const exists = await this.prisma.systemSetting.findUnique({
                where: { key: setting.key },
            });
            if (!exists) {
                await this.prisma.systemSetting.create({
                    data: setting,
                });
            }
        }
    }
    async getSettings() {
        return this.prisma.systemSetting.findMany({
            orderBy: { category: 'asc' },
        });
    }
    async updateSetting(key, value, userId) {
        const setting = await this.prisma.systemSetting.update({
            where: { key },
            data: { value },
        });
        await this.auditService.log(userId, 'UPDATE_SETTING', {
            key,
            value,
        });
        return setting;
    }
};
exports.SettingsService = SettingsService;
exports.SettingsService = SettingsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        audit_service_1.AuditService])
], SettingsService);
//# sourceMappingURL=settings.service.js.map