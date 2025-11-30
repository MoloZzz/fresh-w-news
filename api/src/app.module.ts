import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NewsModule } from './news/news.module';
import { UserModule } from './user/user.module';
import { OpenNewsModule } from './integrations/open-news/open-news.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    NewsModule,
    UserModule,
    OpenNewsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
