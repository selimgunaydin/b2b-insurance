import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CmsService {
  constructor(private prisma: PrismaService) {}

  async getAllContent() {
    return this.prisma.websiteContent.findMany({
      orderBy: [{ category: 'asc' }, { key: 'asc' }],
    });
  }

  async getContentByCategory(category: string) {
    return this.prisma.websiteContent.findMany({
      where: { category },
    });
  }

  async getContentByKey(key: string) {
    return this.prisma.websiteContent.findUnique({
      where: { key },
    });
  }

  async getMultipleByKeys(keys: string[]) {
    return this.prisma.websiteContent.findMany({
      where: { key: { in: keys } },
    });
  }

  async upsertContent(
    key: string,
    value: string,
    type: string,
    category: string,
  ) {
    return this.prisma.websiteContent.upsert({
      where: { key },
      create: { key, value, type, category },
      update: { value, type, category },
    });
  }

  async bulkUpsert(
    items: Array<{
      key: string;
      value: string;
      type: string;
      category: string;
    }>,
  ) {
    const results = [];
    for (const item of items) {
      const result = await this.upsertContent(
        item.key,
        item.value,
        item.type,
        item.category,
      );
      results.push(result);
    }
    return results;
  }

  async deleteContent(key: string) {
    return this.prisma.websiteContent.delete({
      where: { key },
    });
  }

  // Initialize default content with comprehensive website structure
  async initializeDefaults() {
    const defaults = [
      // === GENERAL / BRANDING ===
      {
        key: 'site_logo',
        value: '/logo.png',
        type: 'IMAGE_URL',
        category: 'GENERAL',
      },
      {
        key: 'site_name',
        value: 'B2B Sigorta',
        type: 'TEXT',
        category: 'GENERAL',
      },
      {
        key: 'site_tagline',
        value: 'Dijital Sigorta Platformu',
        type: 'TEXT',
        category: 'GENERAL',
      },
      {
        key: 'footer_text',
        value: '© 2024 B2B Sigorta. Tüm hakları saklıdır.',
        type: 'TEXT',
        category: 'GENERAL',
      },

      // === HOME PAGE ===
      {
        key: 'hero_title',
        value: 'Dijital Sigorta Platformu',
        type: 'TEXT',
        category: 'HOME',
      },
      {
        key: 'hero_subtitle',
        value: 'Tali ve sigorta şirketleri için modern, hızlı ve güvenli çözüm',
        type: 'TEXT',
        category: 'HOME',
      },
      {
        key: 'hero_cta_primary',
        value: 'Hemen Başla',
        type: 'TEXT',
        category: 'HOME',
      },
      {
        key: 'hero_cta_secondary',
        value: 'İletişime Geç',
        type: 'TEXT',
        category: 'HOME',
      },
      {
        key: 'hero_background',
        value: '',
        type: 'IMAGE_URL',
        category: 'HOME',
      },
      {
        key: 'features_title',
        value: 'Neden B2B Sigorta?',
        type: 'TEXT',
        category: 'HOME',
      },
      {
        key: 'features_subtitle',
        value: 'Modern teknoloji ile sigorta süreçlerinizi kolaylaştırın',
        type: 'TEXT',
        category: 'HOME',
      },
      {
        key: 'feature_1_title',
        value: 'Hızlı İşlemler',
        type: 'TEXT',
        category: 'HOME',
      },
      {
        key: 'feature_1_description',
        value:
          'Poliçe oluşturma ve yönetim süreçlerinizi dakikalar içinde tamamlayın',
        type: 'TEXT',
        category: 'HOME',
      },
      {
        key: 'feature_2_title',
        value: 'Güvenli Platform',
        type: 'TEXT',
        category: 'HOME',
      },
      {
        key: 'feature_2_description',
        value: 'Verileriniz en yüksek güvenlik standartlarıyla korunur',
        type: 'TEXT',
        category: 'HOME',
      },
      {
        key: 'feature_3_title',
        value: 'Kolay Yönetim',
        type: 'TEXT',
        category: 'HOME',
      },
      {
        key: 'feature_3_description',
        value: 'Müşterilerinizi ve poliçelerinizi tek bir platformdan yönetin',
        type: 'TEXT',
        category: 'HOME',
      },
      {
        key: 'feature_4_title',
        value: 'Ödül Sistemi',
        type: 'TEXT',
        category: 'HOME',
      },
      {
        key: 'feature_4_description',
        value: 'Hedeflerinizi tamamlayarak ödüller kazanın',
        type: 'TEXT',
        category: 'HOME',
      },
      {
        key: 'cta_title',
        value: 'Hemen Başlayın',
        type: 'TEXT',
        category: 'HOME',
      },
      {
        key: 'cta_subtitle',
        value: 'Dijital dönüşümünüzü bugün başlatın, farkı hemen görün',
        type: 'TEXT',
        category: 'HOME',
      },
      {
        key: 'cta_button',
        value: 'Ücretsiz Dene',
        type: 'TEXT',
        category: 'HOME',
      },

      // === ABOUT PAGE ===
      {
        key: 'about_title',
        value: 'Hakkımızda',
        type: 'TEXT',
        category: 'ABOUT',
      },
      {
        key: 'about_text',
        value:
          'B2B Sigorta, tali sigortacılar ve sigorta şirketleri arasında köprü görevi gören modern bir dijital platformdur. Misyonumuz, sigorta sektöründeki tüm paydaşların işlerini kolaylaştırmak ve dijital dönüşümlerini hızlandırmaktır.',
        type: 'HTML',
        category: 'ABOUT',
      },
      {
        key: 'about_vision',
        value: "Türkiye'nin en güvenilir dijital sigorta platformu olmak.",
        type: 'TEXT',
        category: 'ABOUT',
      },
      {
        key: 'about_mission',
        value:
          'Sigorta sektörünü dijitalleştirerek, tali sigortacıların ve sigorta şirketlerinin iş süreçlerini kolaylaştırmak.',
        type: 'TEXT',
        category: 'ABOUT',
      },
      {
        key: 'about_image',
        value: '',
        type: 'IMAGE_URL',
        category: 'ABOUT',
      },

      // === CONTACT PAGE ===
      {
        key: 'contact_title',
        value: 'İletişim',
        type: 'TEXT',
        category: 'CONTACT',
      },
      {
        key: 'contact_subtitle',
        value: 'Sorularınız için bize ulaşın',
        type: 'TEXT',
        category: 'CONTACT',
      },
      {
        key: 'contact_phone',
        value: '+90 XXX XXX XX XX',
        type: 'TEXT',
        category: 'CONTACT',
      },
      {
        key: 'contact_email',
        value: 'info@b2bsigorta.com',
        type: 'TEXT',
        category: 'CONTACT',
      },
      {
        key: 'contact_address',
        value: 'İstanbul, Türkiye',
        type: 'TEXT',
        category: 'CONTACT',
      },
      {
        key: 'contact_working_hours',
        value: 'Pazartesi - Cuma: 09:00 - 18:00',
        type: 'TEXT',
        category: 'CONTACT',
      },
      {
        key: 'contact_map_embed',
        value: '',
        type: 'HTML',
        category: 'CONTACT',
      },

      // === SOCIAL MEDIA ===
      {
        key: 'social_facebook',
        value: '',
        type: 'TEXT',
        category: 'SOCIAL',
      },
      {
        key: 'social_twitter',
        value: '',
        type: 'TEXT',
        category: 'SOCIAL',
      },
      {
        key: 'social_instagram',
        value: '',
        type: 'TEXT',
        category: 'SOCIAL',
      },
      {
        key: 'social_linkedin',
        value: '',
        type: 'TEXT',
        category: 'SOCIAL',
      },
      {
        key: 'social_whatsapp',
        value: '',
        type: 'TEXT',
        category: 'SOCIAL',
      },

      // === SEO / META ===
      {
        key: 'seo_title',
        value: 'B2B Sigorta | Dijital Sigorta Platformu',
        type: 'TEXT',
        category: 'SEO',
      },
      {
        key: 'seo_description',
        value:
          'Tali ve sigorta şirketleri için modern B2B sigorta yönetim platformu. Hızlı, güvenli ve kolay.',
        type: 'TEXT',
        category: 'SEO',
      },
      {
        key: 'seo_keywords',
        value: 'sigorta, b2b, tali, poliçe, dijital sigorta',
        type: 'TEXT',
        category: 'SEO',
      },

      // === REFERENCES ===
      {
        key: 'references_title',
        value: 'Referanslarımız',
        type: 'TEXT',
        category: 'REFERENCES',
      },
      {
        key: 'references_subtitle',
        value: 'Birlikte çalıştığımız sigorta şirketleri',
        type: 'TEXT',
        category: 'REFERENCES',
      },
    ];

    for (const content of defaults) {
      const exists = await this.prisma.websiteContent.findUnique({
        where: { key: content.key },
      });

      if (!exists) {
        await this.prisma.websiteContent.create({ data: content });
      }
    }
  }
}
