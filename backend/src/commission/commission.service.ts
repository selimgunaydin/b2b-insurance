import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { PrismaService } from '../prisma/prisma.service';
import { MembershipType } from '@prisma/client';

const CACHE_TTL = 300000; // 5 minutes in milliseconds

@Injectable()
export class CommissionService {
  constructor(
    private prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async getRatesForMembership(membershipType: string) {
    const cacheKey = `commission_rates_${membershipType}`;

    // Try to get from cache
    const cached = await this.cacheManager.get(cacheKey);
    if (cached) {
      return cached;
    }

    const settings = await this.prisma.systemSetting.findMany({
      where: {
        key: { startsWith: `commission_${membershipType}_` },
      },
    });

    const result = settings.map((s) => ({
      insuranceType: s.key.split('_')[2],
      rate: parseFloat(s.value),
    }));

    // Store in cache
    await this.cacheManager.set(cacheKey, result, CACHE_TTL);

    return result;
  }

  async getAllRates() {
    const cacheKey = 'commission_all_rates';

    // Try to get from cache
    const cached = await this.cacheManager.get(cacheKey);
    if (cached) {
      return cached;
    }

    const settings = await this.prisma.systemSetting.findMany({
      where: { category: 'COMMISSION' },
    });

    const result = settings.map((s) => {
      const parts = s.key.split('_');
      return {
        id: s.id,
        key: s.key,
        membershipType: parts[1],
        insuranceType: parts[2],
        rate: parseFloat(s.value),
      };
    });

    // Store in cache
    await this.cacheManager.set(cacheKey, result, CACHE_TTL);

    return result;
  }

  async updateRate(id: string, rate: number) {
    const result = await this.prisma.systemSetting.update({
      where: { id },
      data: { value: rate.toString() },
    });

    // Invalidate cache
    await this.cacheManager.del('commission_all_rates');
    await this.cacheManager.del('commission_rates_STANDARD');
    await this.cacheManager.del('commission_rates_PREMIUM');

    return result;
  }
}
