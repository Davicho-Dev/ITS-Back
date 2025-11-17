import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export default registerAs(
  'database',
  (): TypeOrmModuleOptions => ({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_DATABASE || 'users_microservice',
    entities: [__dirname + '/../../infrastructure/persistence/entities/*.entity{.ts,.js}'],
    synchronize: process.env.NODE_ENV !== 'production', // Auto-sync schema in development
    logging: process.env.NODE_ENV === 'development',
    migrations: [__dirname + '/../../infrastructure/persistence/migrations/*{.ts,.js}'],
    migrationsRun: false,
  }),
);
