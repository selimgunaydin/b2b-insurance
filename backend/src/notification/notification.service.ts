import { Injectable, Logger, Inject, forwardRef } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationType } from '@prisma/client';
import { NotificationGateway } from './notification.gateway';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    private prisma: PrismaService,
    @Inject(forwardRef(() => NotificationGateway))
    private notificationGateway: NotificationGateway,
  ) {}

  sendWhatsapp(phone: string, message: string) {
    this.logger.log(`[WHATSAPP] Sending to ${phone}: ${message}`);
    return Promise.resolve(true);
  }

  async notifyCancellationStatus(
    userId: string,
    status: string,
    policyNumber: string,
  ) {
    this.logger.log(
      `[NOTIFY] Cancellation status ${status} for policy ${policyNumber} to user ${userId}`,
    );

    const statusText =
      status === 'APPROVED'
        ? 'onaylandı'
        : status === 'REJECTED'
          ? 'reddedildi'
          : 'güncellendi';

    return this.createSystemNotification(
      userId,
      'İptal Talebi Güncellendi',
      `Poliçe ${policyNumber} için iptal talebiniz ${statusText}.`,
      NotificationType.CANCELLATION,
    );
  }

  async notifyAdmins(title: string, message: string) {
    this.logger.log(`[NOTIFY] Admin notification: ${title} - ${message}`);

    // Find all admin users and create notifications
    const admins = await this.prisma.user.findMany({
      where: { role: 'ADMIN' },
      select: { id: true },
    });

    const notifications = await Promise.all(
      admins.map((admin) =>
        this.prisma.notification.create({
          data: {
            userId: admin.id,
            title,
            message,
            type: NotificationType.SYSTEM,
          },
        }),
      ),
    );

    // Send real-time notification to all admins
    this.notificationGateway.sendToAdmins('notification', {
      title,
      message,
      type: 'SYSTEM',
      createdAt: new Date().toISOString(),
    });

    return { count: notifications.length, success: true };
  }

  async notifyOfferReady(userId: string, requestId: string) {
    this.logger.log(
      `[NOTIFY] Offer ready for request ${requestId} to user ${userId}`,
    );
    return this.createSystemNotification(
      userId,
      'Teklif Hazır',
      'Sigorta teklifiniz hazır. Hemen inceleyebilirsiniz.',
      NotificationType.OFFER,
    );
  }

  async notifyPolicyCreated(userId: string, policyNumber: string) {
    this.logger.log(
      `[NOTIFY] Policy created ${policyNumber} to user ${userId}`,
    );
    return this.createSystemNotification(
      userId,
      'Poliçe Oluşturuldu',
      `Poliçe numarası ${policyNumber} olan poliçeniz başarıyla oluşturuldu.`,
      NotificationType.POLICY,
    );
  }

  async createSystemNotification(
    userId: string,
    title: string,
    message: string,
    type: NotificationType = NotificationType.SYSTEM,
  ) {
    // Validate that user exists before creating notification
    if (!userId) {
      this.logger.warn(`[NOTIFY] Cannot create notification: userId is empty`);
      return null;
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      this.logger.warn(
        `[NOTIFY] Cannot create notification: User ${userId} not found`,
      );
      return null;
    }

    const notification = await this.prisma.notification.create({
      data: {
        userId,
        title,
        message,
        type,
      },
    });

    // Send real-time notification via WebSocket
    this.notificationGateway.sendToUser(userId, 'notification', {
      id: notification.id,
      title,
      message,
      type,
      isRead: false,
      createdAt: notification.createdAt.toISOString(),
    });

    return notification;
  }

  async notifyMarketPurchase(
    purchaseId: string,
    userId: string,
    status: string = 'PENDING',
  ) {
    this.logger.log(
      `[NOTIFY] Market purchase ${purchaseId} for user ${userId} status ${status}`,
    );

    const statusMessages: Record<string, string> = {
      PENDING: 'Sipariş alındı ve onay bekliyor.',
      APPROVED: 'Siparişiniz onaylandı.',
      SHIPPED: 'Siparişiniz kargoya verildi.',
      DELIVERED: 'Siparişiniz teslim edildi.',
      COMPLETED: 'Siparişiniz tamamlandı.',
      REJECTED: 'Siparişiniz reddedildi.',
    };

    return this.createSystemNotification(
      userId,
      'Market Siparişi',
      statusMessages[status] || `Sipariş durumu: ${status}`,
      NotificationType.MARKET,
    );
  }

  async sendNotification(dto: any) {
    const type = dto.type || NotificationType.ADMIN_MESSAGE;

    // Send to all users (excluding admins)
    if (dto.target === 'ALL') {
      const users = await this.prisma.user.findMany({
        where: { role: 'TALI' },
        select: { id: true },
      });

      const notifications = await Promise.all(
        users.map((user) =>
          this.createSystemNotification(user.id, dto.title, dto.message, type),
        ),
      );

      return { count: notifications.length, success: true };
    }

    // Send to multiple specific users
    if (dto.target === 'USERS' && dto.userIds?.length) {
      const notifications = await Promise.all(
        dto.userIds.map((userId: string) =>
          this.createSystemNotification(userId, dto.title, dto.message, type),
        ),
      );

      return { count: notifications.length, success: true };
    }

    // Send to single user
    if (dto.userId) {
      const notification = await this.createSystemNotification(
        dto.userId,
        dto.title,
        dto.message,
        type,
      );
      return { count: 1, success: true, notification };
    }

    throw new Error(
      'No valid target specified. Provide userId, userIds with target=USERS, or target=ALL',
    );
  }

  async findAll(userId: string) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getUnreadCount(userId: string) {
    return this.prisma.notification.count({
      where: { userId, isRead: false },
    });
  }

  async markAsRead(id: string, userId: string) {
    return this.prisma.notification.updateMany({
      where: { id, userId },
      data: { isRead: true },
    });
  }

  async markAllAsRead(userId: string) {
    return this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
  }

  async notifyPremiumStatus(userId: string, status: string) {
    this.logger.log(`[NOTIFY] Premium status ${status} to user ${userId}`);

    const statusMessages: Record<string, string> = {
      PENDING: 'Premium üyelik talebiniz alındı ve inceleniyor.',
      APPROVED: 'Tebrikler! Premium üyelik talebiniz onaylandı.',
      REJECTED: 'Premium üyelik talebiniz reddedildi.',
    };

    return this.createSystemNotification(
      userId,
      'Premium Üyelik',
      statusMessages[status] || `Premium üyelik durumu: ${status}`,
      NotificationType.PREMIUM,
    );
  }
}
