"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var WhatsAppService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhatsAppService = void 0;
const common_1 = require("@nestjs/common");
let WhatsAppService = WhatsAppService_1 = class WhatsAppService {
    logger = new common_1.Logger(WhatsAppService_1.name);
    enabled = false;
    apiKey = '';
    senderNumber = '';
    configure(enabled, apiKey, senderNumber) {
        this.enabled = enabled;
        this.apiKey = apiKey;
        this.senderNumber = senderNumber;
        this.logger.log(`WhatsApp configured: enabled=${enabled}`);
    }
    async sendPolicyNotification(phoneNumber, customerName, policyNumber, company, premium, startDate, endDate, policyUrl) {
        if (!this.enabled) {
            this.logger.warn('WhatsApp is not enabled');
            return false;
        }
        const message = this.formatPolicyMessage(customerName, policyNumber, company, premium, startDate, endDate, policyUrl);
        try {
            this.logger.log(`[MOCK] Sending WhatsApp to ${phoneNumber}:`);
            this.logger.log(message);
            return true;
        }
        catch (error) {
            this.logger.error(`Failed to send WhatsApp: ${error}`);
            return false;
        }
    }
    formatPolicyMessage(customerName, policyNumber, company, premium, startDate, endDate, policyUrl) {
        const formatDate = (date) => {
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

Poliçe belgeniz: ${policyUrl}

B2B Sigorta ekibi olarak hizmetinizdeyiz.`;
    }
};
exports.WhatsAppService = WhatsAppService;
exports.WhatsAppService = WhatsAppService = WhatsAppService_1 = __decorate([
    (0, common_1.Injectable)()
], WhatsAppService);
//# sourceMappingURL=whatsapp.service.js.map