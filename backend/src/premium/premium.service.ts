import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PremiumRequestStatus, MembershipType } from '@prisma/client';

import { NotificationService } from '../notification/notification.service';

@Injectable()
export class PremiumService {
  constructor(
    private prisma: PrismaService,
    private notificationService: NotificationService,
  ) {}

  async createRequest(userId: string, paymentMethod: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { taliProfile: true },
    });

    if (!user || !user.taliProfile) {
      throw new Error('User profile not found');
    }

    // Check if already premium
    if (user.taliProfile.membershipType === MembershipType.PREMIUM) {
      throw new Error('Already a Premium member');
    }

    // Check for pending request
    const pendingRequest = await this.prisma.premiumRequest.findFirst({
      where: {
        taliId: user.taliProfile.id,
        status: PremiumRequestStatus.PENDING,
      },
    });

    if (pendingRequest) {
      throw new Error('You already have a pending request');
    }

    return this.prisma.premiumRequest.create({
      data: {
        taliId: user.taliProfile.id,
        paymentMethod,
        status: PremiumRequestStatus.PENDING,
      },
    });
  }

  async findAllRequests() {
    return this.prisma.premiumRequest.findMany({
      include: {
        tali: {
          include: { user: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async approveRequest(id: string) {
    const request = await this.prisma.premiumRequest.findUnique({
      where: { id },
      include: { tali: true },
    });

    if (!request) throw new Error('Request not found');
    if (request.status !== PremiumRequestStatus.PENDING) {
      throw new Error('Request is not pending');
    }

    // Update request status and User membership
    const result = await this.prisma.$transaction([
      this.prisma.premiumRequest.update({
        where: { id },
        data: { status: PremiumRequestStatus.APPROVED },
      }),
      this.prisma.taliProfile.update({
        where: { id: request.taliId },
        data: { membershipType: MembershipType.PREMIUM },
      }),
    ]);

    await this.notificationService.notifyPremiumStatus(
      request.tali.userId,
      'APPROVED',
    );

    return result;
  }

  async rejectRequest(id: string) {
    const request = await this.prisma.premiumRequest.findUnique({
      where: { id },
      include: { tali: true },
    });

    if (!request) throw new Error('Request not found');

    const updatedRequest = await this.prisma.premiumRequest.update({
      where: { id },
      data: { status: PremiumRequestStatus.REJECTED },
    });

    await this.notificationService.notifyPremiumStatus(
      request.tali.userId,
      'REJECTED',
    );

    return updatedRequest;
  }
}
