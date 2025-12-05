import { NotificationType } from '@prisma/client';
export declare class SendNotificationDto {
    userId?: string;
    userIds?: string[];
    phone?: string;
    email?: string;
    message: string;
    title: string;
    type?: NotificationType;
    target?: 'ALL' | 'USER' | 'USERS';
}
