import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CmsService {
    constructor(private prisma: PrismaService) { }

    async getAllContent() {
        return this.prisma.websiteContent.findMany({
            orderBy: { category: 'asc' },
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

    async upsertContent(key: string, value: string, type: string, category: string) {
        return this.prisma.websiteContent.upsert({
            where: { key },
            create: { key, value, type, category },
            update: { value, type, category },
        });
    }

    async deleteContent(key: string) {
        return this.prisma.websiteContent.delete({
            where: { key },
        });
    }

    // Initialize default content
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
}
