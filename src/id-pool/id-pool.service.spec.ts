import { Test, TestingModule } from '@nestjs/testing';
import { IdPoolService } from './id-pool.service';

describe('IdPoolService', () => {
  let service: IdPoolService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IdPoolService],
    }).compile();

    service = module.get<IdPoolService>(IdPoolService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
