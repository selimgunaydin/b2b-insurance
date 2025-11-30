import { Module } from '@nestjs/common';
import { CancellationController } from './cancellation.controller';
import { CancellationService } from './cancellation.service';

@Module({
  controllers: [CancellationController],
  providers: [CancellationService],
})
export class CancellationModule {}
