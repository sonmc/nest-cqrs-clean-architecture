import { Module } from '@nestjs/common';
import { SeedCommand } from './seed.command';
import { JwtTokenModule } from '../services/jwt.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSource } from '../configuration/typeorm.config';
import 'dotenv/config';

@Module({
  imports: [TypeOrmModule.forRoot(dataSource.options), JwtTokenModule],
  providers: [SeedCommand],
})
export class CommanderModule {}
