// MANTENIMIENTO CORRECTIVO — Alvaro Montalvan

import { Module } from '@nestjs/common';
import { InstrumentsService } from './instruments.service';
import { InstrumentsController } from './instruments.controller';
import { DatabaseModule } from '../../database/database.module';
import { EventsModule } from '../events/events.module';
import { AppLogger } from '../../logger/app-logger.service';

@Module({
  imports: [DatabaseModule, EventsModule],
  controllers: [InstrumentsController],
  providers: [InstrumentsService, AppLogger],
})
export class InstrumentsModule {}