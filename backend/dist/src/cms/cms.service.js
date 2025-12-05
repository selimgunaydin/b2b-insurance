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
exports.CmsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let CmsService = class CmsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getAllContent() {
        return this.prisma.websiteContent.findMany({
            orderBy: [{ category: 'asc' }, { key: 'asc' }],
        });
    }
    async getContentByCategory(category) {
        return this.prisma.websiteContent.findMany({
            where: { category },
        });
    }
    async getContentByKey(key) {
        return this.prisma.websiteContent.findUnique({
            where: { key },
        });
    }
    async getMultipleByKeys(keys) {
        return this.prisma.websiteContent.findMany({
            where: { key: { in: keys } },
        });
    }
    async upsertContent(key, value, type, category) {
        return this.prisma.websiteContent.upsert({
            where: { key },
            create: { key, value, type, category },
            update: { value, type, category },
        });
    }
    async bulkUpsert(items) {
        const results = [];
        for (const item of items) {
            const result = await this.upsertContent(item.key, item.value, item.type, item.category);
            results.push(result);
        }
        return results;
    }
    async deleteContent(key) {
        return this.prisma.websiteContent.delete({
            where: { key },
        });
    }
    async initializeDefaults() {
        const defaults = [
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
                value: 'Poliçe oluşturma ve yönetim süreçlerinizi dakikalar içinde tamamlayın',
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
            {
                key: 'about_title',
                value: 'Hakkımızda',
                type: 'TEXT',
                category: 'ABOUT',
            },
            {
                key: 'about_text',
                value: 'B2B Sigorta, tali sigortacılar ve sigorta şirketleri arasında köprü görevi gören modern bir dijital platformdur. Misyonumuz, sigorta sektöründeki tüm paydaşların işlerini kolaylaştırmak ve dijital dönüşümlerini hızlandırmaktır.',
                type: 'HTML',
                category: 'ABOUT',
            },
            {
                key: 'about_vision',
                value: 'Türkiye\'nin en güvenilir dijital sigorta platformu olmak.',
                type: 'TEXT',
                category: 'ABOUT',
            },
            {
                key: 'about_mission',
                value: 'Sigorta sektörünü dijitalleştirerek, tali sigortacıların ve sigorta şirketlerinin iş süreçlerini kolaylaştırmak.',
                type: 'TEXT',
                category: 'ABOUT',
            },
            {
                key: 'about_image',
                value: '',
                type: 'IMAGE_URL',
                category: 'ABOUT',
            },
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
            {
                key: 'seo_title',
                value: 'B2B Sigorta | Dijital Sigorta Platformu',
                type: 'TEXT',
                category: 'SEO',
            },
            {
                key: 'seo_description',
                value: 'Tali ve sigorta şirketleri için modern B2B sigorta yönetim platformu. Hızlı, güvenli ve kolay.',
                type: 'TEXT',
                category: 'SEO',
            },
            {
                key: 'seo_keywords',
                value: 'sigorta, b2b, tali, poliçe, dijital sigorta',
                type: 'TEXT',
                category: 'SEO',
            },
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
};
exports.CmsService = CmsService;
exports.CmsService = CmsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CmsService);
//# sourceMappingURL=cms.service.js.map