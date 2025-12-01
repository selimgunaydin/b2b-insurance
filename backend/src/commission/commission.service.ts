import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MembershipType } from '@prisma/client';

@Injectable()
export class CommissionService {
  constructor(private prisma: PrismaService) { }

  async getRatesForMembership(membershipType: string) {
    const settings = await this.prisma.systemSetting.findMany({
      where: {
        key: { startsWith: `commission_${membershipType}_` },
      },
    });
    return settings.map((s) => ({
      insuranceType: s.key.split('_')[2],
      rate: parseFloat(s.value),
    }));
  }

  async getAllRates() {
    const settings = await this.prisma.systemSetting.findMany({
      where: { category: 'COMMISSION' },
    });
    return settings.map((s) => {
      const parts = s.key.split('_');
      return {
        id: s.id,
        key: s.key,
        membershipType: parts[1],
        insuranceType: parts[2],
        rate: parseFloat(s.value),
      };
    });
  }

  async updateRate(id: string, rate: number) {
    return this.prisma.systemSetting.update({
      where: { id },
      data: { value: rate.toString() },
    });
  }
}
