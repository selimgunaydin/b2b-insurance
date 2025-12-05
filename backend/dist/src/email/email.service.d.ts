import { ConfigService } from '@nestjs/config';
interface EmailOptions {
    to: string;
    subject: string;
    text?: string;
    html?: string;
}
export declare class EmailService {
    private configService;
    private readonly logger;
    private transporter;
    constructor(configService: ConfigService);
    private initializeTransporter;
    private getFrom;
    sendEmail(options: EmailOptions): Promise<boolean>;
    sendWelcomeEmail(to: string, name: string): Promise<boolean>;
    sendApprovalEmail(to: string, name: string): Promise<boolean>;
    sendPolicyCreatedEmail(to: string, name: string, policyNumber: string, policyType: string): Promise<boolean>;
    sendPolicyRenewalReminder(to: string, name: string, policyNumber: string, expiryDate: string): Promise<boolean>;
    sendBadgeEarnedEmail(to: string, name: string, badgeName: string, badgeDescription: string): Promise<boolean>;
}
export {};
