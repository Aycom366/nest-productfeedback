import { Test, TestingModule } from '@nestjs/testing';
import { SubcommentService } from './subcomment.service';

describe('SubcommentService', () => {
  let service: SubcommentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubcommentService],
    }).compile();

    service = module.get<SubcommentService>(SubcommentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
