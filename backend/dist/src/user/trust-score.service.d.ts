import { PrismaService } from '../prisma/prisma.service';
export declare class TrustScoreService {
    private prisma;
    constructor(prisma: PrismaService);
    private readonly SCORES;
    updateTrustScore(taliId: string, event: keyof typeof this.SCORES): Promise<void>;
}
