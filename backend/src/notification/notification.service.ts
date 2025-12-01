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

  async notifyAdmins(title: string, message: string) {
    const admins = await this.prisma.user.findMany({
      where: { role: Role.ADMIN },
    });

    const notifications = admins.map((admin) => ({
      userId: admin.id,
      title,
      message,
      type: NotificationType.SYSTEM,
    }));

    if (notifications.length > 0) {
      await this.prisma.notification.createMany({
        data: notifications,
      });
    }
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
  async notifyOfferReady(userId: string, requestTitle: string) {
    return this.createSystemNotification(
      userId,
      'Teklif Hazır',
      `"${requestTitle}" için teklifiniz hazır. Detayları inceleyebilirsiniz.`,
      NotificationType.OFFER,
    );
  }

  async notifyPolicyCreated(userId: string, policyNumber: string) {
    return this.createSystemNotification(
      userId,
      'Poliçe Oluşturuldu',
      `${policyNumber} numaralı poliçeniz başarıyla oluşturuldu.`,
      NotificationType.POLICY,
    );
  }

  async notifyCancellationStatus(
    userId: string,
    status: string,
    policyNumber: string,
  ) {
    const statusText = status === 'APPROVED' ? 'onaylandı' : 'reddedildi';
    return this.createSystemNotification(
      userId,
      'İptal Talebi Güncellemesi',
      `${policyNumber} numaralı poliçe için iptal talebiniz ${statusText}.`,
      NotificationType.CANCELLATION,
    );
  }

  async notifyPremiumStatus(userId: string, status: string) {
    const statusText = status === 'APPROVED' ? 'onaylandı' : 'reddedildi';
    return this.createSystemNotification(
      userId,
      'Premium Üyelik',
      `Premium üyelik başvurunuz ${statusText}.`,
      NotificationType.PREMIUM,
    );
  }

  async notifyMarketPurchase(
    userId: string,
    productName: string,
    status: string,
  ) {
    let message = `"${productName}" siparişiniz alındı.`;
    if (status === 'SHIPPED')
      message = `"${productName}" siparişiniz kargoya verildi.`;
    if (status === 'DELIVERED')
      message = `"${productName}" siparişiniz teslim edildi.`;
    if (status === 'REJECTED')
      message = `"${productName}" siparişiniz iptal edildi.`;

    return this.createSystemNotification(
      userId,
      'Market Siparişi',
      message,
      NotificationType.MARKET,
    );
  }
}
