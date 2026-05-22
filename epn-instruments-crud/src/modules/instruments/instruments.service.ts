import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InstrumentEntity } from '../../database/entities/instrument.entity';
import { CreateInstrumentDto } from './dto/create-instrument.dto';
import { UpdateInstrumentDto } from './dto/update-instrument.dto';
import { EventsService } from '../events/events.service';

@Injectable()
export class InstrumentsService {
  constructor(
    @InjectRepository(InstrumentEntity)
    private readonly instrumentRepository: Repository<InstrumentEntity>,
    private readonly eventsService: EventsService,
  ) { }

  async create(createInstrumentDto: CreateInstrumentDto): Promise<InstrumentEntity> {
    // Validación: cantidad no debe ser negativa
    if (createInstrumentDto.cantidad < 0) {
      throw new BadRequestException('La cantidad no puede ser negativa');
    }

    // Validación: precio no debe ser negativo
    if (createInstrumentDto.precio < 0) {
      throw new BadRequestException('El precio no puede ser negativo');
    }

    const instrument = this.instrumentRepository.create(createInstrumentDto);
    const savedInstrument = await this.instrumentRepository.save(instrument);

    // Enviar evento de creación
    await this.eventsService.onCreateInstrument(savedInstrument);

    return savedInstrument;
  }

  async findAll(): Promise<InstrumentEntity[]> {
    const instruments = await this.instrumentRepository.find();

    // Enviar evento de consulta
    await this.eventsService.onQueryInstruments(instruments.length, {
      action: 'findAll',
    });

    return instruments;
  }

  async findOne(id: number): Promise<InstrumentEntity> {
    const instrument = await this.instrumentRepository.findOne({
      where: { id },
    });

    if (!instrument) {
      throw new NotFoundException(`Instrumento con ID ${id} no encontrado`);
    }

    // Enviar evento de consulta
    await this.eventsService.onQueryInstruments(1, {
      action: 'findOne',
      id,
    });

    return instrument;
  }

  async findByTipo(tipo: string): Promise<InstrumentEntity[]> {
    const instruments = await this.instrumentRepository.find({
      where: { tipo },
    });

    // Enviar evento de consulta
    await this.eventsService.onQueryInstruments(instruments.length, {
      action: 'findByTipo',
      tipo,
    });

    return instruments;
  }

  async update(id: number, updateInstrumentDto: UpdateInstrumentDto): Promise<InstrumentEntity> {
    // Obtener el instrumento actual
    const existingInstrument = await this.findOne(id);

    // Validaciones
    if (updateInstrumentDto.cantidad !== undefined && updateInstrumentDto.cantidad < 0) {
      throw new BadRequestException('La cantidad no puede ser negativa');
    }

    if (updateInstrumentDto.precio !== undefined && updateInstrumentDto.precio < 0) {
      throw new BadRequestException('El precio no puede ser negativo');
    }

    // Actualizar solo los campos proporcionados
    const before = { ...existingInstrument };

    Object.assign(existingInstrument, updateInstrumentDto);
    const updatedInstrument = await this.instrumentRepository.save(existingInstrument);

    await this.eventsService.onUpdateInstrument(before, updatedInstrument);

    return updatedInstrument;
  }

  async remove(id: number): Promise<InstrumentEntity> {
    const instrument = await this.findOne(id);
    await this.instrumentRepository.remove(instrument);

    // Enviar evento de eliminación
    await this.eventsService.onDeleteInstrument(instrument);

    return instrument;
  }

  async updateQuantity(id: number, quantityChange: number): Promise<InstrumentEntity> {
    const instrument = await this.findOne(id);
    const newQuantity = instrument.cantidad + quantityChange;

    if (newQuantity < 0) {
      throw new BadRequestException(
        `No hay suficiente cantidad. Disponible: ${instrument.cantidad}`,
      );
    }

    instrument.cantidad = newQuantity;
    const updatedInstrument = await this.instrumentRepository.save(instrument);

    // Enviar evento
    await this.eventsService.onUpdateInstrument(instrument, updatedInstrument);

    return updatedInstrument;
  }

  async getInventorySummary(): Promise<any> {
    const instruments = await this.instrumentRepository.find();

    const summary = {
      totalInstruments: instruments.length,
      totalValue: instruments.reduce((sum, inst) => sum + Number(inst.precio) * inst.cantidad, 0),
      instrumentsByType: {} as Record<string, number>,
      lowStockItems: [] as InstrumentEntity[],
    };

    for (const instrument of instruments) {
      summary.instrumentsByType[instrument.tipo] = (summary.instrumentsByType[instrument.tipo] || 0) + 1;

      if (instrument.cantidad < 3) {
        summary.lowStockItems.push(instrument);
      }
    }

    // Enviar evento de consulta de resumen
    await this.eventsService.onQueryInstruments(instruments.length, {
      action: 'getInventorySummary',
    });

    return summary;
  }
}
