import { PrismaService } from '../prisma/prisma.service';
import { NotificationType } from '@prisma/client';
import { NotificationGateway } from './notification.gateway';
export declare class NotificationService {
    private prisma;
    private notificationGateway;
    private readonly logger;
    constructor(prisma: PrismaService, notificationGateway: NotificationGateway);
    sendWhatsapp(phone: string, message: string): Promise<boolean>;
    notifyCancellationStatus(userId: string, status: string, policyNumber: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        message: string;
        type: import("@prisma/client").$Enums.NotificationType;
        title: string;
        isRead: boolean;
    } | null>;
    notifyAdmins(title: string, message: string): Promise<{
        count: number;
        success: boolean;
    }>;
    notifyOfferReady(userId: string, requestId: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        message: string;
        type: import("@prisma/client").$Enums.NotificationType;
        title: string;
        isRead: boolean;
    } | null>;
    notifyPolicyCreated(userId: string, policyNumber: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        message: string;
        type: import("@prisma/client").$Enums.NotificationType;
        title: string;
        isRead: boolean;
    } | null>;
    createSystemNotification(userId: string, title: string, message: string, type?: NotificationType): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        message: string;
        type: import("@prisma/client").$Enums.NotificationType;
        title: string;
        isRead: boolean;
    } | null>;
    notifyMarketPurchase(purchaseId: string, userId: string, status?: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        message: string;
        type: import("@prisma/client").$Enums.NotificationType;
        title: string;
        isRead: boolean;
    } | null>;
    sendNotification(dto: any): Promise<{
        count: number;
        success: boolean;
        notification?: undefined;
    } | {
        count: number;
        success: boolean;
        notification: {
            id: string;
            createdAt: Date;
            userId: string;
            message: string;
            type: import("@prisma/client").$Enums.NotificationType;
            title: string;
            isRead: boolean;
        } | null;
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
    } | null>;
}
