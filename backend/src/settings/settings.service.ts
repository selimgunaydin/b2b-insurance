import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class SettingsService implements OnModuleInit {
  constructor(
    private prisma: PrismaService,
    private auditService: AuditService,
  ) {}

  async onModuleInit() {
    await this.initializeDefaultSettings();
  }

  async initializeDefaultSettings() {
    const defaults = [
      // === GENERAL SETTINGS ===
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
        key: 'premium_system_active',
        value: 'false',
        type: 'BOOLEAN',
        category: 'GENERAL',
        description: 'Premium sistemi aktif mi?',
      },
      // === SECURITY SETTINGS ===
      {
        key: 'allow_new_registration',
        value: 'true',
        type: 'BOOLEAN',
        category: 'SECURITY',
        description: 'Yeni üye alımı açık mı?',
      },
      // === INSURANCE TYPE SETTINGS ===
      {
        key: 'insurance_type_TRAFIK_enabled',
        value: 'true',
        type: 'BOOLEAN',
        category: 'INSURANCE_TYPES',
        description: 'Trafik Sigortası Aktif mi?',
      },
      {
        key: 'insurance_type_KASKO_enabled',
        value: 'true',
        type: 'BOOLEAN',
        category: 'INSURANCE_TYPES',
        description: 'Kasko Sigortası Aktif mi?',
      },
      {
        key: 'insurance_type_SAGLIK_enabled',
        value: 'true',
        type: 'BOOLEAN',
        category: 'INSURANCE_TYPES',
        description: 'Sağlık Sigortası Aktif mi?',
      },
      {
        key: 'insurance_type_DASK_enabled',
        value: 'true',
        type: 'BOOLEAN',
        category: 'INSURANCE_TYPES',
        description: 'DASK Sigortası Aktif mi?',
      },
      {
        key: 'insurance_type_KONUT_enabled',
        value: 'true',
        type: 'BOOLEAN',
        category: 'INSURANCE_TYPES',
        description: 'Konut Sigortası Aktif mi?',
      },
      // === TRUST SCORE RESTRICTIONS ===
      {
        key: 'trust_score_enabled',
        value: 'false',
        type: 'BOOLEAN',
        category: 'TRUST_RESTRICTIONS',
        description: 'Güven puanı kısıtlamaları aktif mi?',
      },
      {
        key: 'trust_score_min_all',
        value: '50',
        type: 'NUMBER',
        category: 'TRUST_RESTRICTIONS',
        description: 'Tüm poliçeler için minimum güven puanı',
      },
      {
        key: 'trust_score_min_SAGLIK',
        value: '80',
        type: 'NUMBER',
        category: 'TRUST_RESTRICTIONS',
        description: 'Sağlık sigortası için minimum güven puanı',
      },
      {
        key: 'trust_score_min_KASKO',
        value: '70',
        type: 'NUMBER',
        category: 'TRUST_RESTRICTIONS',
        description: 'Kasko sigortası için minimum güven puanı',
      },
      {
        key: 'trust_score_min_KONUT',
        value: '60',
        type: 'NUMBER',
        category: 'TRUST_RESTRICTIONS',
        description: 'Konut sigortası için minimum güven puanı',
      },
      {
        key: 'trust_score_min_TRAFIK',
        value: '40',
        type: 'NUMBER',
        category: 'TRUST_RESTRICTIONS',
        description: 'Trafik sigortası için minimum güven puanı',
      },
      {
        key: 'trust_score_min_DASK',
        value: '50',
        type: 'NUMBER',
        category: 'TRUST_RESTRICTIONS',
        description: 'DASK sigortası için minimum güven puanı',
      },
      // === COMMISSION SETTINGS ===
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
      // Premium Commission Rates
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
      // === NOTIFICATION SETTINGS ===
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

  async getTrustRestrictionsForUser(userId: string) {
    const insuranceTypes = ['TRAFIK', 'KASKO', 'SAGLIK', 'DASK', 'KONUT'];
    
    // Get user's trust score
    const taliProfile = await this.prisma.taliProfile.findUnique({
      where: { userId },
    });
    
    if (!taliProfile) {
      return {
        trustScoreEnabled: false,
        userTrustScore: 0,
        restrictions: insuranceTypes.map(type => ({
          type,
          allowed: true,
          reason: null,
          minRequired: 0,
        })),
      };
    }

    // Check if trust score system is enabled
    const trustEnabledSetting = await this.prisma.systemSetting.findUnique({
      where: { key: 'trust_score_enabled' },
    });
    const trustEnabled = trustEnabledSetting?.value === 'true';

    if (!trustEnabled) {
      return {
        trustScoreEnabled: false,
        userTrustScore: taliProfile.trustScore,
        restrictions: insuranceTypes.map(type => ({
          type,
          allowed: true,
          reason: null,
          minRequired: 0,
        })),
      };
    }

    // Get general minimum
    const minAllSetting = await this.prisma.systemSetting.findUnique({
      where: { key: 'trust_score_min_all' },
    });
    const minAll = minAllSetting ? parseInt(minAllSetting.value) : 50;

    const restrictions = [];
    
    for (const type of insuranceTypes) {
      // Check type-specific minimum
      const typeMinSetting = await this.prisma.systemSetting.findUnique({
        where: { key: `trust_score_min_${type}` },
      });
      const typeMin = typeMinSetting ? parseInt(typeMinSetting.value) : minAll;
      const effectiveMin = Math.max(minAll, typeMin);
      
      const allowed = taliProfile.trustScore >= effectiveMin;
      restrictions.push({
        type,
        allowed,
        reason: allowed ? null : `Güven puanınız (${taliProfile.trustScore}) bu sigorta türü için gereken minimum değerin (${effectiveMin}) altında.`,
        minRequired: effectiveMin,
      });
    }

    return {
      trustScoreEnabled: true,
      userTrustScore: taliProfile.trustScore,
      restrictions,
    };
  }
}
