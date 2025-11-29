import { Module } from '@nestjs/common';
import { OpenNewsService } from './open-news.service';

@Module({
  providers: [OpenNewsService],
})
export class OpenNewsModule {}
