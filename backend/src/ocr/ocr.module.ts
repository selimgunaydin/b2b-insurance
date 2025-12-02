import { Module } from '@nestjs/common';
import { OcrService } from './ocr.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [OcrService],
  exports: [OcrService],
})
export class OcrModule {}
