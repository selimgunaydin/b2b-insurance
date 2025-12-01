import { PrismaService } from '../prisma/prisma.service';
import { SendNotificationDto } from './dto/notification.dto';
import { NotificationType } from '@prisma/client';
export declare class NotificationService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    sendNotification(dto: SendNotificationDto): Promise<{
        success: boolean;
        count: number;
        message?: undefined;
    } | {
        success: boolean;
        message: string;
        count?: undefined;
    }>;
    notifyAdmins(title: string, message: string): Promise<void>;
    createSystemNotification(userId: string, title: string, message: string, type?: NotificationType): Promise<{
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
    markAsRead(id: string, userId: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        message: string;
        type: import("@prisma/client").$Enums.NotificationType;
        title: string;
        isRead: boolean;
    }>;
    markAllAsRead(userId: string): Promise<import("@prisma/client").Prisma.BatchPayload>;
    getUnreadCount(userId: string): Promise<number>;
    handleCron(): Promise<void>;
    notifyOfferReady(userId: string, requestTitle: string): Promise<{
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
    notifyCancellationStatus(userId: string, status: string, policyNumber: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        message: string;
        type: import("@prisma/client").$Enums.NotificationType;
        title: string;
        isRead: boolean;
    }>;
    notifyPremiumStatus(userId: string, status: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        message: string;
        type: import("@prisma/client").$Enums.NotificationType;
        title: string;
        isRead: boolean;
    }>;
    notifyMarketPurchase(userId: string, productName: string, status: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        message: string;
        type: import("@prisma/client").$Enums.NotificationType;
        title: string;
        isRead: boolean;
    }>;
}
