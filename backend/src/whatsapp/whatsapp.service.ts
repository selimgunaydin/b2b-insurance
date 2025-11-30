import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class WhatsAppService {
    private readonly logger = new Logger(WhatsAppService.name);
    private enabled = false;
    private apiKey = '';
    private senderNumber = '';

    configure(enabled: boolean, apiKey: string, senderNumber: string) {
        this.enabled = enabled;
        this.apiKey = apiKey;
        this.senderNumber = senderNumber;
        this.logger.log(`WhatsApp configured: enabled=${enabled}`);
    }

    async sendPolicyNotification(
        phoneNumber: string,
        customerName: string,
        policyNumber: string,
        company: string,
        premium: number,
        startDate: Date,
        endDate: Date,
        pdfUrl: string
    ): Promise<boolean> {
        if (!this.enabled) {
            this.logger.warn('WhatsApp is not enabled');
            return false;
        }

        const message = this.formatPolicyMessage(
            customerName,
            policyNumber,
            company,
            premium,
            startDate,
            endDate,
            pdfUrl
        );

        try {
            // TODO: Implement actual Twilio/WhatsApp Business API call
            // For now, just log the message
            this.logger.log(`[MOCK] Sending WhatsApp to ${phoneNumber}:`);
            this.logger.log(message);

            // Simulate API call
            // await this.twilioClient.messages.create({
            //   from: `whatsapp:${this.senderNumber}`,
            //   to: `whatsapp:${phoneNumber}`,
            //   body: message,
            // });

            return true;
        } catch (error) {
            this.logger.error(`Failed to send WhatsApp: ${error}`);
            return false;
        }
    }

    private formatPolicyMessage(
        customerName: string,
        policyNumber: string,
        company: string,
        premium: number,
        startDate: Date,
        endDate: Date,
        pdfUrl: string
    ): string {
        const formatDate = (date: Date) => {
            return date.toLocaleDateString('tr-TR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
        };

        return `Merhaba ${customerName},

Poliçeniz başarıyla oluşturuldu! 🎉

📋 Poliçe No: ${policyNumber}
🏢 Firma: ${company}
💰 Prim: ${premium.toFixed(2)} TL
📅 Geçerlilik: ${formatDate(startDate)} - ${formatDate(endDate)}

Poliçe belgeniz: ${pdfUrl}

B2B Sigorta ekibi olarak hizmetinizdeyiz.`;
    }
}
