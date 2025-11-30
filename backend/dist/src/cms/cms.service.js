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
            orderBy: { category: 'asc' },
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
    async upsertContent(key, value, type, category) {
        return this.prisma.websiteContent.upsert({
            where: { key },
            create: { key, value, type, category },
            update: { value, type, category },
        });
    }
    async deleteContent(key) {
        return this.prisma.websiteContent.delete({
            where: { key },
        });
    }
    async initializeDefaults() {
        const defaults = [
            { key: 'hero_title', value: 'B2B Sigorta Platformu', type: 'TEXT', category: 'HOME' },
            { key: 'hero_subtitle', value: 'Tali ve sigorta şirketleri için modern dijital çözüm', type: 'TEXT', category: 'HOME' },
            { key: 'about_title', value: 'Hakkımızda', type: 'TEXT', category: 'ABOUT' },
            { key: 'about_text', value: 'B2B Sigorta, tali sigortacılar ve sigorta şirketleri arasında köprü görevi gören modern bir dijital platformdur.', type: 'HTML', category: 'ABOUT' },
            { key: 'contact_phone', value: '+90 XXX XXX XX XX', type: 'TEXT', category: 'CONTACT' },
            { key: 'contact_email', value: 'info@b2bsigorta.com', type: 'TEXT', category: 'CONTACT' },
            { key: 'contact_address', value: 'İstanbul, Türkiye', type: 'TEXT', category: 'CONTACT' },
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