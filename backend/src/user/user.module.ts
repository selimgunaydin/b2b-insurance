import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaModule } from '../prisma/prisma.module';
import { TrustScoreService } from './trust-score.service';

@Module({
  imports: [PrismaModule],
  controllers: [UserController],
  providers: [UserService, TrustScoreService],
  exports: [UserService, TrustScoreService],
})
export class UserModule {}
