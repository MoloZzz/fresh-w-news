import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
dotenv.config();
import { join } from 'path';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,

  entities: [join(__dirname, '..', '**', '*.entity.{ts,js}')],
  migrations: [
    join(__dirname, '..', '..', 'src', 'database', 'migrations', '*.{ts,js}'),
  ],

  ssl:
    process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false,

  synchronize: false,
  logging: false,
});
