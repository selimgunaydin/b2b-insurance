"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const path_1 = require("path");
const swagger_1 = require("@nestjs/swagger");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const logger = new common_1.Logger('Bootstrap');
    app.set('trust proxy', 1);
    app.enableCors({
        origin: [
            'http://localhost:3000',
            'https://b2b-insurance-frontend.onrender.com',
            'https://b2b-insurance-backend.onrender.com',
        ],
        credentials: true,
    });
    app.use((0, cookie_parser_1.default)());
    app.useGlobalPipes(new common_1.ValidationPipe({ whitelist: true }));
    app.useStaticAssets((0, path_1.join)(__dirname, '..', 'uploads'), {
        prefix: '/uploads/',
    });
    const config = new swagger_1.DocumentBuilder()
        .setTitle('B2B Sigorta API')
        .setDescription(`
      B2B Sigorta Platformu API Dokümantasyonu
      
      ## Özellikler
      - Kullanıcı yönetimi ve kimlik doğrulama
      - Sigorta talebi oluşturma ve takibi
      - Poliçe yönetimi
      - Komisyon ve ödeme işlemleri
      - Bildirim sistemi
      - Hedef ve ödül sistemi
      - CMS içerik yönetimi
      - Market ve ürün satışı
    `)
        .setVersion('1.0')
        .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'JWT token girin',
    }, 'JWT-auth')
        .addCookieAuth('access_token')
        .addTag('Auth', 'Kimlik doğrulama işlemleri')
        .addTag('Users', 'Kullanıcı yönetimi')
        .addTag('Insurance', 'Sigorta talepleri ve poliçeler')
        .addTag('Notifications', 'Bildirim sistemi')
        .addTag('Commission', 'Komisyon oranları')
        .addTag('Goals', 'Hedef ve ödül sistemi')
        .addTag('Market', 'Ürün ve market işlemleri')
        .addTag('CMS', 'İçerik yönetimi')
        .addTag('Admin', 'Admin işlemleri')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api-docs', app, document, {
        swaggerOptions: {
            persistAuthorization: true,
            tagsSorter: 'alpha',
            operationsSorter: 'alpha',
        },
        customSiteTitle: 'B2B Sigorta API Docs',
    });
    const port = process.env.PORT ?? 3001;
    await app.listen(port);
    logger.log(`Application is running on: http://localhost:${port}`);
    logger.log(`Swagger API docs available at: http://localhost:${port}/api-docs`);
}
bootstrap();
//# sourceMappingURL=main.js.map