import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const logger = new Logger('Bootstrap');
  
  app.set('trust proxy', 1); // Trust proxy for Render/Heroku
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'https://b2b-insurance-frontend.onrender.com',
      'https://b2b-insurance-backend.onrender.com',
    ],
    credentials: true,
  });
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // Serve static files (e.g. uploaded PDFs)
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  // Swagger API Documentation
  const config = new DocumentBuilder()
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
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'JWT token girin',
      },
      'JWT-auth',
    )
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

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document, {
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

