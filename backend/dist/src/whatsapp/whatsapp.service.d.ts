export declare class WhatsAppService {
    private readonly logger;
    private enabled;
    private apiKey;
    private senderNumber;
    configure(enabled: boolean, apiKey: string, senderNumber: string): void;
    sendPolicyNotification(phoneNumber: string, customerName: string, policyNumber: string, company: string, premium: number, startDate: Date, endDate: Date, pdfUrl: string): Promise<boolean>;
    private formatPolicyMessage;
}
