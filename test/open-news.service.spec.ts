import { Test, TestingModule } from '@nestjs/testing';
import { OpenNewsService } from '../src/integrations/open-news/open-news.service';

describe('OpenNewsService', () => {
  let service: OpenNewsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OpenNewsService],
    }).compile();

    service = module.get<OpenNewsService>(OpenNewsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
