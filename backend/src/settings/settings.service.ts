import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class SettingsService implements OnModuleInit {
    constructor(
        private prisma: PrismaService,
        private auditService: AuditService,
    ) { }

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
            // Insurance Type Global Toggles
            { key: 'insurance_type_TRAFIK_enabled', value: 'true', type: 'BOOLEAN', category: 'GENERAL', description: 'Trafik Sigortası Aktif mi?' },
            { key: 'insurance_type_KASKO_enabled', value: 'true', type: 'BOOLEAN', category: 'GENERAL', description: 'Kasko Sigortası Aktif mi?' },
            { key: 'insurance_type_SAGLIK_enabled', value: 'true', type: 'BOOLEAN', category: 'GENERAL', description: 'Sağlık Sigortası Aktif mi?' },
            { key: 'insurance_type_DASK_enabled', value: 'true', type: 'BOOLEAN', category: 'GENERAL', description: 'DASK Sigortası Aktif mi?' },
            { key: 'insurance_type_KONUT_enabled', value: 'true', type: 'BOOLEAN', category: 'GENERAL', description: 'Konut Sigortası Aktif mi?' },
            // Standard Commission Rates
            { key: 'commission_STANDARD_TRAFIK', value: '5', type: 'NUMBER', category: 'COMMISSION', description: 'Standart - Trafik Komisyonu (%)' },
            { key: 'commission_STANDARD_KASKO', value: '10', type: 'NUMBER', category: 'COMMISSION', description: 'Standart - Kasko Komisyonu (%)' },
            { key: 'commission_STANDARD_SAGLIK', value: '10', type: 'NUMBER', category: 'COMMISSION', description: 'Standart - Sağlık Komisyonu (%)' },
            { key: 'commission_STANDARD_DASK', value: '8', type: 'NUMBER', category: 'COMMISSION', description: 'Standart - DASK Komisyonu (%)' },
            { key: 'commission_STANDARD_KONUT', value: '12', type: 'NUMBER', category: 'COMMISSION', description: 'Standart - Konut Komisyonu (%)' },
            // Premium Commission Rates
            { key: 'commission_PREMIUM_TRAFIK', value: '8', type: 'NUMBER', category: 'COMMISSION', description: 'Premium - Trafik Komisyonu (%)' },
            { key: 'commission_PREMIUM_KASKO', value: '15', type: 'NUMBER', category: 'COMMISSION', description: 'Premium - Kasko Komisyonu (%)' },
            { key: 'commission_PREMIUM_SAGLIK', value: '15', type: 'NUMBER', category: 'COMMISSION', description: 'Premium - Sağlık Komisyonu (%)' },
            { key: 'commission_PREMIUM_DASK', value: '12', type: 'NUMBER', category: 'COMMISSION', description: 'Premium - DASK Komisyonu (%)' },
            { key: 'commission_PREMIUM_KONUT', value: '18', type: 'NUMBER', category: 'COMMISSION', description: 'Premium - Konut Komisyonu (%)' },
            {
                key: 'email_notifications',
                value: 'true',
                type: 'BOOLEAN',
                category: 'NOTIFICATIONS',
                description: 'E-posta bildirimleri açık mı?',
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

    async updateSetting(key: string, value: string, userId: string) {
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
}
