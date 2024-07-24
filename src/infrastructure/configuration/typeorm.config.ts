import { DataSource } from 'typeorm';
import { registerAs } from '@nestjs/config';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { User } from '@domain/schemas/user.schema';
import { Role } from '@domain/schemas/role.schema';
import { Perm } from '@domain/schemas/perm.schema';
import { UserRole } from '@domain/schemas/roles_users.schema';
import { RolePerm } from '@domain/schemas/roles_perms.schema';

config();

const configService = new ConfigService();
export const dataSource = new DataSource({
  type: 'mysql',
  host: configService.get('DB_HOST'),
  port: configService.get('DB_PORT'),
  username: configService.get('DB_USER'),
  password: configService.get('DB_PASSWORD'),
  database: configService.get('DB_NAME'),
  entities: ['src/domain/schemas/*.schema.ts'],
  synchronize: process.env.NODE_ENV === 'development',
  logging: configService.get('nodenv') === 'development',
  migrations: [`src/infrastructure/migrations/*{.ts,.js}`],
  migrationsTableName: 'migrations',
});

export default registerAs('database', () => ({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 3306,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [User, Role, Perm, UserRole, RolePerm],
  synchronize: process.env.NODE_ENV === 'development',
  logging: process.env.NODE_ENV === 'development',
  migrations: [__dirname + `infrastructure/migrations/*{.ts,.js}`],
  migrationsTableName: 'migrations',
  cli: {
    migrationsDir: __dirname + 'infrastructure/migrations',
  },
}));
