import { Test, TestingModule } from '@nestjs/testing';
import { CancellationController } from './cancellation.controller';

describe('CancellationController', () => {
  let controller: CancellationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CancellationController],
    }).compile();

    controller = module.get<CancellationController>(CancellationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
