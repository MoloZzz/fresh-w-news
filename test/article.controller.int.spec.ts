import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NewsModule } from '../src/news/news.module';
import { ArticleEntity } from 'src/news/common/entity/article.entity';

describe('GET /news/article/:id (integration)', () => {
  let app: INestApplication;

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
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const repo = moduleFixture.get('ArticleEntityRepository');
    await repo.save({
      id: '111',
      title: 'Article test',
      author: 'John',
      sourceName: 'CNN',
      category: 'world',
      publishedAt: new Date(),
      description: 'Short',
      url: '',
      imageUrl: '',
      content: '',
    });
  });

  it('should return article by id', async () => {
    const res = await request(app.getHttpServer()).get('/news/article/111');

    expect(res.status).toBe(200);
    expect(res.body.id).toBe('111');
    expect(res.body.title).toBe('Article test');
  });

  it('should return 404 if not found', async () => {
    const res = await request(app.getHttpServer()).get('/news/article/999');

    expect(res.status).toBe(404);
  });

  afterAll(async () => {
    await app.close();
  });
});
