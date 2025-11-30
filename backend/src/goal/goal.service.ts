import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GoalTargetType, RewardType, InsuranceType } from '@prisma/client';

@Injectable()
export class GoalService {
  private readonly logger = new Logger(GoalService.name);

  constructor(private prisma: PrismaService) {}

  async create(data: {
    title: string;
    description?: string;
    targetType: GoalTargetType;
    policyType?: InsuranceType;
    targetValue: number;
    rewardType: RewardType;
    rewardValue: number;
    startDate: Date;
    endDate: Date;
  }) {
    const goal = await this.prisma.goal.create({
      data: {
        ...data,
        rewardValue: data.rewardValue,
      },
    });

    // Assign to all existing Talis
    await this.assignGoalToAllTalis(goal.id);

    return goal;
  }

  async assignGoalToAllTalis(goalId: string) {
    const talis = await this.prisma.taliProfile.findMany();

    const taliGoals = talis.map((tali) => ({
      taliId: tali.id,
      goalId,
      currentValue: 0,
      isCompleted: false,
    }));

    // Use createMany with skipDuplicates if possible, but TaliGoal has unique constraint
    // Prisma createMany skipDuplicates is supported in some DBs. Postgres supports it.
    await this.prisma.taliGoal.createMany({
      data: taliGoals,
      skipDuplicates: true,
    });
  }

  async findAll() {
    return this.prisma.goal.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async getTaliGoals(userId: string) {
    const taliProfile = await this.prisma.taliProfile.findUnique({
      where: { userId },
    });

    if (!taliProfile) return [];

    return this.prisma.taliGoal.findMany({
      where: { taliId: taliProfile.id },
      include: { goal: true },
      orderBy: { goal: { endDate: 'asc' } },
    });
  }

  async checkProgress(
    taliId: string,
    policyType: InsuranceType,
    premium: number,
  ) {
    // Find active goals for this Tali that match the policy type (or ALL)
    const activeGoals = await this.prisma.taliGoal.findMany({
      where: {
        taliId,
        isCompleted: false,
        goal: {
          isActive: true,
          startDate: { lte: new Date() },
          endDate: { gte: new Date() },
          OR: [
            { policyType: null }, // Applies to all types
            { policyType: policyType },
          ],
        },
      },
      include: { goal: true },
    });

    for (const taliGoal of activeGoals) {
      let increment = 0;
      if (taliGoal.goal.targetType === 'COUNT') {
        increment = 1;
      } else if (taliGoal.goal.targetType === 'PREMIUM') {
        increment = Math.floor(premium); // Or exact decimal if schema allows, schema has Int for targetValue
      }

      const newValue = taliGoal.currentValue + increment;
      let isCompleted = false;

      if (newValue >= taliGoal.goal.targetValue) {
        isCompleted = true;
      }

      await this.prisma.taliGoal.update({
        where: { id: taliGoal.id },
        data: {
          currentValue: newValue,
          isCompleted,
          completedAt: isCompleted ? new Date() : null,
        },
      });

      if (isCompleted) {
        await this.grantReward(taliId, taliGoal.goal);
      }
    }
  }

  private async grantReward(taliId: string, goal: any) {
    if (goal.rewardType === 'CASH') {
      // Add to balance
      await this.prisma.taliProfile.update({
        where: { id: taliId },
        data: {
          balance: { increment: goal.rewardValue },
        },
      });

      // Log reward
      await this.prisma.reward.create({
        data: {
          taliId,
          amount: goal.rewardValue,
          description: `Hedef Tamamlandı: ${goal.title}`,
        },
      });

      this.logger.log(
        `Reward granted to Tali ${taliId} for goal ${goal.title}`,
      );
    }
  }
}
