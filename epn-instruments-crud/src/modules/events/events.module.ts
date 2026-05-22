import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { EventsService } from './events.service';

@Module({
  imports: [HttpModule],
  providers: [EventsService],
  exports: [EventsService],
})
export class EventsModule {}
