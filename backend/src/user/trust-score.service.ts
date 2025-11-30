import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TrustScoreService {
  constructor(private prisma: PrismaService) {}

  private readonly SCORES = {
    POLICY_COMPLETED: 10,
    POLICY_CANCELLED: -20,
    OFFER_REJECTED: -1,
    OFFER_EXPIRED: -2,
  };

  async updateTrustScore(taliId: string, event: keyof typeof this.SCORES) {
    const change = this.SCORES[event];

    await this.prisma.taliProfile.update({
      where: { id: taliId },
      data: {
        trustScore: {
          increment: change,
        },
      },
    });
  }

  // Optional: Method to recalculate score from scratch if needed in future
  // async recalculateScore(taliId: string) { ... }
}
