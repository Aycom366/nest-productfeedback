import { Test, TestingModule } from '@nestjs/testing';
import { SubcommentController } from './subcomment.controller';

describe('SubcommentController', () => {
  let controller: SubcommentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubcommentController],
    }).compile();

    controller = module.get<SubcommentController>(SubcommentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
