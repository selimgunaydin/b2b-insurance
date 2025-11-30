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
    rewardPoints: number;
    startDate: Date;
    endDate: Date;
  }) {
    try {
      return await this.prisma.$transaction(async (prisma) => {
        const goal = await prisma.goal.create({
          data: {
            ...data,
            targetValue: Math.floor(data.targetValue || 0), // Ensure integer and prevent NaN
            rewardPoints: data.rewardPoints,
          },
        });

        // Assign to all existing Talis
        const talis = await prisma.taliProfile.findMany();
        if (talis.length > 0) {
          const taliGoals = talis.map((tali) => ({
            taliId: tali.id,
            goalId: goal.id,
            currentValue: 0,
            isCompleted: false,
          }));

          await prisma.taliGoal.createMany({
            data: taliGoals,
            skipDuplicates: true,
          });
        }

        return goal;
      });
    } catch (error) {
      this.logger.error('Failed to create goal:', error);
      throw error;
    }
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
    if (goal.rewardType === RewardType.POINTS) {
      // Add to points
      await this.prisma.taliProfile.update({
        where: { id: taliId },
        data: {
          points: { increment: goal.rewardPoints },
        },
      });

      // Create Reward Record
      await this.prisma.reward.create({
        data: {
          taliId,
          points: goal.rewardPoints,
          description: `Hedef Tamamlandı: ${goal.title}`,
        },
      });

      this.logger.log(
        `Reward granted to Tali ${taliId} for goal ${goal.title}`,
      );
    }
  }
}
