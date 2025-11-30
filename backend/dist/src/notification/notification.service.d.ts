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
    createSystemNotification(userId: string, title: string, message: string, type?: NotificationType): Promise<{
        id: string;
        createdAt: Date;
        message: string;
        type: import("@prisma/client").$Enums.NotificationType;
        userId: string;
        title: string;
        isRead: boolean;
    }>;
    findAll(userId: string): Promise<{
        id: string;
        createdAt: Date;
        message: string;
        type: import("@prisma/client").$Enums.NotificationType;
        userId: string;
        title: string;
        isRead: boolean;
    }[]>;
    markAsRead(id: string, userId: string): Promise<{
        id: string;
        createdAt: Date;
        message: string;
        type: import("@prisma/client").$Enums.NotificationType;
        userId: string;
        title: string;
        isRead: boolean;
    }>;
    markAllAsRead(userId: string): Promise<import("@prisma/client").Prisma.BatchPayload>;
    handleCron(): Promise<void>;
}
