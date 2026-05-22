import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class EventsService {
  private eventManagerUrl = 'http://localhost:3000/events';

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

      await firstValueFrom(
        this.httpService.post(this.eventManagerUrl, event),
      );

      console.log(
        `✅ Evento enviado: ${action} en ${entity} desde ${source}`,
      );
    } catch (error) {
      console.error('❌ Error al enviar evento:', error.message);
      // No lanzar excepción para que el CRUD continúe funcionando
      // aunque el Event Manager no esté disponible
    }
  }

  async onCreateInstrument(instrument: any): Promise<void> {
    await this.sendEvent(
      'instruments-crud',
      'Instrument',
      'CREATE',
      `Instrumento creado: ${instrument.nombre}`,
      `Se creó un nuevo instrumento de tipo ${instrument.tipo}`,
      instrument,
    );
  }

  async onUpdateInstrument(
    oldInstrument: any,
    newInstrument: any,
  ): Promise<void> {
    await this.sendEvent(
      'instruments-crud',
      'Instrument',
      'UPDATE',
      `Instrumento actualizado: ${newInstrument.nombre}`,
      `Se actualizó el instrumento con ID ${newInstrument.id}`,
      {
        before: oldInstrument,
        after: newInstrument,
      },
    );
  }

  async onDeleteInstrument(instrument: any): Promise<void> {
    await this.sendEvent(
      'instruments-crud',
      'Instrument',
      'DELETE',
      `Instrumento eliminado: ${instrument.nombre}`,
      `Se eliminó el instrumento con ID ${instrument.id}`,
      instrument,
    );
  }

  async onQueryInstruments(count: number, filters: any): Promise<void> {
    await this.sendEvent(
      'instruments-crud',
      'Instrument',
      'QUERY',
      'Consulta de instrumentos realizada',
      `Se consultaron ${count} instrumento(s)`,
      filters,
    );
  }
}
