import { config } from 'dotenv';
import { DataSource } from 'typeorm';
import { databaseConfig } from './src/config/database.config';

// Load .env file
config();

export default new DataSource({
  ...databaseConfig,
  migrations: ['src/database/migrations/*{.ts,.js}'],
  entities: ['src/**/*.entity{.ts,.js}'],
} as any);

