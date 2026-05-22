import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InstrumentEntity } from '../../database/entities/instrument.entity';
import { InstrumentsService } from './instruments.service';
import { InstrumentsController } from './instruments.controller';
import { EventsModule } from '../events/events.module';

@Module({
  imports: [TypeOrmModule.forFeature([InstrumentEntity]), EventsModule],
  controllers: [InstrumentsController],
  providers: [InstrumentsService],
  exports: [InstrumentsService],
})
export class InstrumentsModule {}
