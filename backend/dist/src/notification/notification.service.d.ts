import { PrismaService } from '../prisma/prisma.service';
import { NotificationType } from '@prisma/client';
export declare class NotificationService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    sendWhatsapp(phone: string, message: string): Promise<boolean>;
    notifyCancellationStatus(policyId: string, status: string, userId: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        message: string;
        type: import("@prisma/client").$Enums.NotificationType;
        title: string;
        isRead: boolean;
    }>;
    notifyAdmins(title: string, message: string): Promise<boolean>;
    notifyOfferReady(userId: string, requestId: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        message: string;
        type: import("@prisma/client").$Enums.NotificationType;
        title: string;
        isRead: boolean;
    }>;
    notifyPolicyCreated(userId: string, policyNumber: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        message: string;
        type: import("@prisma/client").$Enums.NotificationType;
        title: string;
        isRead: boolean;
    }>;
    createSystemNotification(userId: string, title: string, message: string, type?: NotificationType): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        message: string;
        type: import("@prisma/client").$Enums.NotificationType;
        title: string;
        isRead: boolean;
    }>;
    notifyMarketPurchase(purchaseId: string, userId: string, status?: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        message: string;
        type: import("@prisma/client").$Enums.NotificationType;
        title: string;
        isRead: boolean;
    }>;
    sendNotification(dto: any): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        message: string;
        type: import("@prisma/client").$Enums.NotificationType;
        title: string;
        isRead: boolean;
    }>;
    findAll(userId: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        message: string;
        type: import("@prisma/client").$Enums.NotificationType;
        title: string;
        isRead: boolean;
    }[]>;
    getUnreadCount(userId: string): Promise<number>;
    markAsRead(id: string, userId: string): Promise<import("@prisma/client").Prisma.BatchPayload>;
    markAllAsRead(userId: string): Promise<import("@prisma/client").Prisma.BatchPayload>;
    notifyPremiumStatus(userId: string, status: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        message: string;
        type: import("@prisma/client").$Enums.NotificationType;
        title: string;
        isRead: boolean;
    }>;
}
