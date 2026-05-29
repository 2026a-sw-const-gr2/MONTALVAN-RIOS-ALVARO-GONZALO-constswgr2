// MANTENIMIENTO CORRECTIVO — Alvaro Montalvan
// Fix: error tipado como unknown para evitar crash en runtime

import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class EventsService {
  private eventManagerUrl = process.env.EVENT_MANAGER_URL ?? 'http://localhost:3000/events';
  constructor(private readonly httpService: HttpService) {}

  async sendEvent(
    source: string,
    entity: string,
    action: string,
    title: string,
    description: string,
    payload: any,
  ): Promise<void> {
    try {
      const event = {
        source,
        entity,
        action,
        title,
        description,
        payload: typeof payload === 'string' ? payload : JSON.stringify(payload),
      };

      await firstValueFrom(this.httpService.post(this.eventManagerUrl, event));
      console.log(`${new Date().toISOString()} [INFO] [EventsService] Evento enviado: ${action} en ${entity}`);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Error desconocido';
      console.error(`${new Date().toISOString()} [ERROR] [EventsService] Error al enviar evento: ${message}`);
    }
  }

  async onCreateInstrument(instrument: any): Promise<void> {
    await this.sendEvent('instruments-crud', 'Instrument', 'CREATE',
      `Instrumento creado: ${instrument.nombre}`,
      `Se creó un nuevo instrumento de tipo ${instrument.tipo}`, instrument);
  }

  async onUpdateInstrument(oldInstrument: any, newInstrument: any): Promise<void> {
    await this.sendEvent('instruments-crud', 'Instrument', 'UPDATE',
      `Instrumento actualizado: ${newInstrument.nombre}`,
      `Se actualizó el instrumento con ID ${newInstrument.id}`,
      { before: oldInstrument, after: newInstrument });
  }

  async onDeleteInstrument(instrument: any): Promise<void> {
    await this.sendEvent('instruments-crud', 'Instrument', 'DELETE',
      `Instrumento eliminado: ${instrument.nombre}`,
      `Se eliminó el instrumento con ID ${instrument.id}`, instrument);
  }

  async onQueryInstruments(count: number, filters: any): Promise<void> {
    await this.sendEvent('instruments-crud', 'Instrument', 'QUERY',
      'Consulta de instrumentos realizada',
      `Se consultaron ${count} instrumento(s)`, filters);
  }
}