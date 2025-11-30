import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SendNotificationDto } from './dto/notification.dto';
import { NotificationType, Role } from '@prisma/client';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(private prisma: PrismaService) {}

  async sendNotification(dto: SendNotificationDto) {
    // Admin broadcast logic
    if (dto.target === 'ALL') {
      const talis = await this.prisma.user.findMany({
        where: { role: Role.TALI },
      });

      const notifications = talis.map((tali) => ({
        userId: tali.id,
        title: dto.title || 'Duyuru',
        message: dto.message,
        type: NotificationType.ADMIN_MESSAGE,
      }));

      await this.prisma.notification.createMany({
        data: notifications,
      });

      return { success: true, count: notifications.length };
    }

    // Single user logic (if needed in future)
    return { success: false, message: 'Only ALL target supported for now' };
  }

  async createSystemNotification(
    userId: string,
    title: string,
    message: string,
    type: NotificationType = NotificationType.SYSTEM,
  ) {
    return this.prisma.notification.create({
      data: {
        userId,
        title,
        message,
        type,
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async markAsRead(id: string, userId: string) {
    return this.prisma.notification.update({
      where: { id, userId }, // Ensure user owns the notification
      data: { isRead: true },
    });
  }

  async markAllAsRead(userId: string) {
    return this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
  }

  // Run every day at 09:00 AM
  // @Cron('0 9 * * *')
  // For demo purposes, running every minute to test if needed, but let's stick to daily
  @Cron('0 9 * * *')
  async handleCron() {
    this.logger.debug('Checking for policy renewals...');

    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    const startOfDay = new Date(oneYearAgo);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(oneYearAgo);
    endOfDay.setHours(23, 59, 59, 999);

    const expiringPolicies = await this.prisma.insuranceRequest.findMany({
      where: {
        status: 'COMPLETED',
        updatedAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      include: {
        customer: true,
      },
    });

    for (const policy of expiringPolicies) {
      await this.createSystemNotification(
        policy.taliId,
        'Poliçe Yenileme Hatırlatması',
        `Müşteriniz ${policy.customer?.fullName || 'Bilinmeyen'} için poliçe süresi dolmak üzere (1 yıl geçti). Lütfen yenileme teklifi oluşturun.`,
        NotificationType.RENEWAL,
      );
    }

    if (expiringPolicies.length > 0) {
      this.logger.log(`Sent ${expiringPolicies.length} renewal notifications.`);
    }
  }
}
