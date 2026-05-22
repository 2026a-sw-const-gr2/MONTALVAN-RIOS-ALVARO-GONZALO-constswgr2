import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InstrumentEntity } from './entities/instrument.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: 'db/instruments.db',
      entities: [InstrumentEntity],
      synchronize: true,
      logging: false,
    }),
    TypeOrmModule.forFeature([InstrumentEntity]),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
