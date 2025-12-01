import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NewsModule } from '../src/news/news.module';
import { RecommendationsService } from '../src/recommendation/recommendation.service';
import { ArticleEntity } from 'src/news/common/entity/article.entity';

describe('GET /news/feed (integration)', () => {
  let app: INestApplication;

  const recsMock = {
    getUserPreferences: jest.fn().mockResolvedValue({
      categories: ['technology'],
      sources: ['BBC'],
      hiddenKeywords: ['war'],
    }),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          synchronize: true,
          entities: [ArticleEntity],
        }),
        NewsModule,
      ],
    })
      .overrideProvider(RecommendationsService)
      .useValue(recsMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Insert test article
    const repo = moduleFixture.get('ArticleEntityRepository');
    await repo.save([
      {
        id: '1',
        title: 'Tech breakthrough',
        author: 'BBC',
        sourceName: 'BBC',
        category: 'technology',
        publishedAt: new Date(),
        description: 'Some description',
        url: '',
        imageUrl: '',
        content: '',
      },
    ]);
  });

  it('should return filtered news feed', async () => {
    const res = await request(app.getHttpServer()).get('/news/feed');

    expect(res.status).toBe(200);
    expect(res.body.items.length).toBe(1);
    expect(res.body.items[0].title).toBe('Tech breakthrough');
    expect(recsMock.getUserPreferences).not.toHaveBeenCalled(); // cuz not logged in
  });

  afterAll(async () => {
    await app.close();
  });
});
