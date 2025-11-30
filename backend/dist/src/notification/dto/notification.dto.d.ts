export declare class SendNotificationDto {
    phone?: string;
    email?: string;
    message: string;
    title?: string;
    target?: 'ALL' | 'USER';
}
