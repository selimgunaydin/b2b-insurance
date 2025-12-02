import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationType } from '@prisma/client';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(private prisma: PrismaService) {}

  async sendWhatsapp(phone: string, message: string) {
    this.logger.log(`[WHATSAPP] Sending to ${phone}: ${message}`);
    return true;
  }

  async notifyCancellationStatus(policyId: string, status: string, userId: string) {
    this.logger.log(`[NOTIFY] Cancellation status ${status} for policy ${policyId} to user ${userId}`);
    return this.createSystemNotification(userId, 'Cancellation Update', `Your cancellation request is ${status}`);
  }

  async notifyAdmins(title: string, message: string) {
    this.logger.log(`[NOTIFY] Admin notification: ${title} - ${message}`);
    // In real app, find admin users and notify
    return true;
  }

  async notifyOfferReady(requestId: string, userId: string) {
    this.logger.log(`[NOTIFY] Offer ready for request ${requestId} to user ${userId}`);
    return this.createSystemNotification(userId, 'Offer Ready', 'Your insurance offer is ready.');
  }

  async notifyPolicyCreated(requestId: string, userId: string) {
    this.logger.log(`[NOTIFY] Policy created for request ${requestId} to user ${userId}`);
    return this.createSystemNotification(userId, 'Policy Created', 'Your policy has been created.');
  }

  async createSystemNotification(userId: string, title: string, message: string, type: NotificationType = NotificationType.SYSTEM) {
    return this.prisma.notification.create({
      data: {
        userId,
        title,
        message,
        type,
      },
    });
  }

  async notifyMarketPurchase(purchaseId: string, userId: string, status: string = 'PENDING') {
    this.logger.log(`[NOTIFY] Market purchase ${purchaseId} for user ${userId} status ${status}`);
    return this.createSystemNotification(userId, 'Market Purchase', `Your purchase is ${status}.`);
  }

  async sendNotification(dto: any) {
    return this.createSystemNotification(dto.userId, dto.title, dto.message);
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
    return this.createSystemNotification(userId, 'Premium Request Update', `Your premium request is ${status}`);
  }
}
