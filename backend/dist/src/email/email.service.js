"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var EmailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const nodemailer = __importStar(require("nodemailer"));
let EmailService = EmailService_1 = class EmailService {
    configService;
    logger = new common_1.Logger(EmailService_1.name);
    transporter = null;
    constructor(configService) {
        this.configService = configService;
        this.initializeTransporter();
    }
    async initializeTransporter() {
        const smtpHost = this.configService.get('SMTP_HOST');
        const smtpPort = this.configService.get('SMTP_PORT') || 587;
        const smtpUser = this.configService.get('SMTP_USER');
        const smtpPass = this.configService.get('SMTP_PASS');
        if (smtpHost && smtpUser && smtpPass) {
            this.transporter = nodemailer.createTransport({
                host: smtpHost,
                port: smtpPort,
                secure: smtpPort === 465,
                auth: {
                    user: smtpUser,
                    pass: smtpPass,
                },
            });
            this.logger.log('Email transporter initialized');
        }
        else {
            this.logger.warn('Email configuration not found. Email service will log emails instead of sending.');
        }
    }
    getFrom() {
        return (this.configService.get('SMTP_FROM') ||
            'B2B Sigorta <noreply@b2bsigorta.com>');
    }
    async sendEmail(options) {
        if (!this.transporter) {
            this.logger.log(`[EMAIL-MOCK] To: ${options.to}, Subject: ${options.subject}`);
            this.logger.log(`[EMAIL-MOCK] Content: ${options.text || options.html}`);
            return true;
        }
        try {
            await this.transporter.sendMail({
                from: this.getFrom(),
                to: options.to,
                subject: options.subject,
                text: options.text,
                html: options.html,
            });
            this.logger.log(`Email sent to ${options.to}`);
            return true;
        }
        catch (error) {
            this.logger.error(`Failed to send email to ${options.to}: ${error.message}`);
            return false;
        }
    }
    async sendWelcomeEmail(to, name) {
        const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #4F46E5; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f9fafb; }
          .button { display: inline-block; background-color: #4F46E5; color: white !important; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>B2B Sigorta'ya Hoşgeldiniz!</h1>
          </div>
          <div class="content">
            <h2>Merhaba ${name},</h2>
            <p>B2B Sigorta platformumuza kayıt olduğunuz için teşekkür ederiz.</p>
            <p>Hesabınız admin onayı beklemektedir. Onaylandıktan sonra platformu kullanmaya başlayabilirsiniz.</p>
            <p>Onay sürecini hızlandırmak için profil bilgilerinizi eksiksiz doldurmanızı öneririz.</p>
            <a href="${this.configService.get('FRONTEND_URL') || 'http://localhost:3000'}/dashboard" class="button">Panele Git</a>
          </div>
          <div class="footer">
            <p>© 2024 B2B Sigorta. Tüm hakları saklıdır.</p>
          </div>
        </div>
      </body>
      </html>
    `;
        return this.sendEmail({
            to,
            subject: "B2B Sigorta'ya Hoşgeldiniz!",
            html,
        });
    }
    async sendApprovalEmail(to, name) {
        const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #10B981; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f9fafb; }
          .button { display: inline-block; background-color: #10B981; color: white !important; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Hesabınız Onaylandı!</h1>
          </div>
          <div class="content">
            <h2>Merhaba ${name},</h2>
            <p>Harika haber! Hesabınız başarıyla onaylandı.</p>
            <p>Artık B2B Sigorta platformunu tam kapasiteyle kullanabilirsiniz:</p>
            <ul>
              <li>Sigorta talepleri oluşturabilirsiniz</li>
              <li>Müşterilerinizi yönetebilirsiniz</li>
              <li>Komisyonlarınızı takip edebilirsiniz</li>
              <li>Hedefler ve rozetler kazanabilirsiniz</li>
            </ul>
            <a href="${this.configService.get('FRONTEND_URL') || 'http://localhost:3000'}/dashboard" class="button">Hemen Başla</a>
          </div>
          <div class="footer">
            <p>© 2024 B2B Sigorta. Tüm hakları saklıdır.</p>
          </div>
        </div>
      </body>
      </html>
    `;
        return this.sendEmail({
            to,
            subject: 'Hesabınız Onaylandı - B2B Sigorta',
            html,
        });
    }
    async sendPolicyCreatedEmail(to, name, policyNumber, policyType) {
        const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #4F46E5; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f9fafb; }
          .policy-info { background-color: white; padding: 15px; border-radius: 6px; margin: 15px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Poliçe Oluşturuldu</h1>
          </div>
          <div class="content">
            <h2>Merhaba ${name},</h2>
            <p>Müşteriniz için yeni bir poliçe oluşturuldu:</p>
            <div class="policy-info">
              <p><strong>Poliçe No:</strong> ${policyNumber}</p>
              <p><strong>Sigorta Türü:</strong> ${policyType}</p>
            </div>
            <p>Detayları panelinizdenden inceleyebilirsiniz.</p>
          </div>
          <div class="footer">
            <p>© 2024 B2B Sigorta. Tüm hakları saklıdır.</p>
          </div>
        </div>
      </body>
      </html>
    `;
        return this.sendEmail({
            to,
            subject: `Poliçe Oluşturuldu: ${policyNumber}`,
            html,
        });
    }
    async sendPolicyRenewalReminder(to, name, policyNumber, expiryDate) {
        const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #F59E0B; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f9fafb; }
          .warning { background-color: #FEF3C7; padding: 15px; border-radius: 6px; margin: 15px 0; border-left: 4px solid #F59E0B; }
          .button { display: inline-block; background-color: #F59E0B; color: white !important; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>⚠️ Poliçe Yenileme Hatırlatması</h1>
          </div>
          <div class="content">
            <h2>Merhaba ${name},</h2>
            <div class="warning">
              <p><strong>Poliçe No:</strong> ${policyNumber}</p>
              <p><strong>Bitiş Tarihi:</strong> ${expiryDate}</p>
            </div>
            <p>Yukarıdaki poliçenin süresi yaklaşmaktadır. Müşterinizle iletişime geçerek yenileme işlemini başlatmanızı öneririz.</p>
            <a href="${this.configService.get('FRONTEND_URL') || 'http://localhost:3000'}/dashboard" class="button">Panele Git</a>
          </div>
          <div class="footer">
            <p>© 2024 B2B Sigorta. Tüm hakları saklıdır.</p>
          </div>
        </div>
      </body>
      </html>
    `;
        return this.sendEmail({
            to,
            subject: `Poliçe Yenileme Hatırlatması: ${policyNumber}`,
            html,
        });
    }
    async sendBadgeEarnedEmail(to, name, badgeName, badgeDescription) {
        const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #8B5CF6; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f9fafb; text-align: center; }
          .badge { font-size: 48px; margin: 20px 0; }
          .badge-name { font-size: 24px; font-weight: bold; color: #8B5CF6; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🏆 Yeni Rozet Kazandınız!</h1>
          </div>
          <div class="content">
            <h2>Tebrikler ${name}!</h2>
            <div class="badge">🎖️</div>
            <p class="badge-name">${badgeName}</p>
            <p>${badgeDescription}</p>
            <p>Harika iş çıkarıyorsunuz! Devam edin!</p>
          </div>
          <div class="footer">
            <p>© 2024 B2B Sigorta. Tüm hakları saklıdır.</p>
          </div>
        </div>
      </body>
      </html>
    `;
        return this.sendEmail({
            to,
            subject: `Yeni Rozet: ${badgeName} 🏆`,
            html,
        });
    }
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = EmailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], EmailService);
//# sourceMappingURL=email.service.js.map