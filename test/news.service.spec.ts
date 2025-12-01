import { Test, TestingModule } from '@nestjs/testing';
import { RecommendationsService } from 'src/recommendation/recommendation.service';
import { ArticleEntity } from '../src/news/common/entity/article.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NewsService } from '../src/news/services/news.service';

describe('NewsService', () => {
  let service: NewsService;
  let recsMock: { getUserPreferences: jest.Mock };
  let repoMock: {
    createQueryBuilder: jest.Mock;
  };

  const qbMock = {
    orderBy: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    getManyAndCount: jest.fn(),
  };

  beforeEach(async () => {
    recsMock = {
      getUserPreferences: jest.fn(),
    };

    repoMock = {
      createQueryBuilder: jest.fn().mockReturnValue(qbMock),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NewsService,
        { provide: RecommendationsService, useValue: recsMock },
        { provide: getRepositoryToken(ArticleEntity), useValue: repoMock },
      ],
    }).compile();

    service = module.get<NewsService>(NewsService);

    // Reset mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // ------------------------------------------
  // TEST 1: getFeed без userId не звертається до recommendations
  // ------------------------------------------
  it('getFeed() should fetch feed without preferences when no userId', async () => {
    qbMock.getManyAndCount.mockResolvedValue([[], 0]);

    const options = { limit: 10, offset: 0 };

    const result = await service.getFeed(options);

    expect(recsMock.getUserPreferences).not.toHaveBeenCalled();
    expect(result).toEqual({ items: [], total: 0 });
  });

  // ------------------------------------------
  // TEST 2: getFeed з userId -> має витягнути преференції
  // ------------------------------------------
  it('getFeed() should apply user preferences when userId is provided', async () => {
    const fakePrefs = {
      categories: ['business'],
      sources: ['BBC'],
      hiddenKeywords: ['war'],
    };

    recsMock.getUserPreferences.mockResolvedValue(fakePrefs);
    qbMock.getManyAndCount.mockResolvedValue([[{ id: '1' }], 1]);

    const options = { limit: 5 };
    const userId = 'user-123';

    const result = await service.getFeed(options, userId);

    expect(recsMock.getUserPreferences).toHaveBeenCalledWith('user-123');

    // перевірка, що queryBuilder викликав фільтри
    expect(qbMock.andWhere).toHaveBeenCalled();

    expect(result).toEqual({
      items: [{ id: '1' }],
      total: 1,
    });
  });

  // ------------------------------------------
  // TEST 3: applyBaseFilters застосовує фільтр search
  // ------------------------------------------
  it('should apply search filter when search is provided', async () => {
    qbMock.getManyAndCount.mockResolvedValue([[], 0]);

    const options = { search: 'bitcoin' };

    await service.getFeed(options);

    expect(qbMock.andWhere).toHaveBeenCalledWith(
      'a.title ILIKE :search',
      { search: '%bitcoin%' }
    );
  });

  // ------------------------------------------
  // TEST 4: getArticleById викликає repo.findOneBy
  // ------------------------------------------
  it('getArticleById() should call repository.findOneBy', async () => {
    const findMock = jest.fn().mockResolvedValue({ id: '123' });
    (repoMock as any).findOneBy = findMock;

    const article = await service.getArticleById('123');

    expect(findMock).toHaveBeenCalledWith({ id: '123' });
    expect(article).toEqual({ id: '123' });
  });
});
