import { Module } from '@nestjs/common';
import { CronService } from './cron.service';
import { ScheduleModule } from '@nestjs/schedule';
import { NewsModule } from 'src/news/news.module';

@Module({
  imports: [ScheduleModule.forRoot(), NewsModule],
  providers: [CronService],
})
export class CronModule {}
