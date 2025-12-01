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
    to: string,
    customerName: string,
    policyNumber: string,
    company: string,
    premium: number,
    startDate: Date,
    endDate: Date,
    pdfUrl: string,
  ) {
    if (!this.enabled) {
      this.logger.warn('WhatsApp is not enabled');
      return false;
    }

    const message =
      `Sayın *${customerName}*,\n\n` +
      `Poliçeniz başarıyla oluşturulmuştur. ✅\n\n` +
      `📄 *Poliçe No:* ${policyNumber}\n` +
      `🏢 *Sigorta Şirketi:* ${company}\n` +
      `💰 *Prim:* ${premium} TL\n` +
      `📅 *Başlangıç:* ${startDate.toLocaleDateString('tr-TR')}\n` +
      `📅 *Bitiş:* ${endDate.toLocaleDateString('tr-TR')}\n\n` +
      `Poliçenizi aşağıdaki linkten indirebilirsiniz:\n` +
      `${pdfUrl}\n\n` +
      `Bizi tercih ettiğiniz için teşekkür ederiz. 🙏`;

    try {
      // TODO: Implement actual Twilio/WhatsApp Business API call
      // For now, just log the message
      this.logger.log(`[MOCK] Sending WhatsApp to ${to}:`);
      this.logger.log(message);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 100));

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
    policyUrl: string,
  ): string {
    const formatDate = (date: Date) => {
      return date.toLocaleDateString('tr-TR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    };

    return `Merhaba ${customerName},

Poliçeniz başarıyla oluşturuldu! 🎉

📋 Poliçe No: ${policyNumber}
🏢 Firma: ${company}
💰 Prim: ${premium.toFixed(2)} TL
📅 Geçerlilik: ${formatDate(startDate)} - ${formatDate(endDate)}

Poliçe belgeniz: ${policyUrl}

B2B Sigorta ekibi olarak hizmetinizdeyiz.`;
  }
}
