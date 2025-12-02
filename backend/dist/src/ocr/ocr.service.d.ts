import { PrismaService } from '../prisma/prisma.service';
export declare class OcrService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    processImage(filePath: string): Promise<{
        company: string;
        price: number;
    }[]>;
    extract(text: string): Promise<{
        company: string;
        price: number;
    }[]>;
    private extractCorrectPrice;
    private normalizePrice;
}
