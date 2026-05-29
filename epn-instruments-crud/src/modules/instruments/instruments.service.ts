// MANTENIMIENTO CORRECTIVO — Alvaro Montalvan
// Logs estructurados con trazabilidad ISO 8601 en cada operación CRUD

import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InstrumentEntity } from '../../database/entities/instrument.entity';
import { CreateInstrumentDto } from './dto/create-instrument.dto';
import { UpdateInstrumentDto } from './dto/update-instrument.dto';
import { EventsService } from '../events/events.service';
import { AppLogger } from '../../logger/app-logger.service';

@Injectable()
export class InstrumentsService {
  constructor(
    @InjectRepository(InstrumentEntity)
    private readonly instrumentRepository: Repository<InstrumentEntity>,
    private readonly eventsService: EventsService,
    private readonly logger: AppLogger,
  ) {}

  async create(createInstrumentDto: CreateInstrumentDto): Promise<InstrumentEntity> {
    this.logger.info(`[CREATE] Iniciando creación de instrumento: ${createInstrumentDto.nombre}`, 'InstrumentsService');

    if (createInstrumentDto.cantidad < 0) {
      this.logger.warn(`[CREATE] Cantidad negativa rechazada: ${createInstrumentDto.cantidad}`, 'InstrumentsService');
      throw new BadRequestException('La cantidad no puede ser negativa');
    }

    if (createInstrumentDto.precio < 0) {
      this.logger.warn(`[CREATE] Precio negativo rechazado: ${createInstrumentDto.precio}`, 'InstrumentsService');
      throw new BadRequestException('El precio no puede ser negativo');
    }

    const instrument = this.instrumentRepository.create(createInstrumentDto);
    const savedInstrument = await this.instrumentRepository.save(instrument);

    this.logger.info(`[CREATE] Instrumento guardado con ID=${savedInstrument.id} nombre="${savedInstrument.nombre}"`, 'InstrumentsService');
    await this.eventsService.onCreateInstrument(savedInstrument);

    return savedInstrument;
  }

  async findAll(): Promise<InstrumentEntity[]> {
    this.logger.info('[QUERY] Consultando todos los instrumentos', 'InstrumentsService');
    const instruments = await this.instrumentRepository.find();
    this.logger.info(`[QUERY] Se encontraron ${instruments.length} instrumento(s)`, 'InstrumentsService');

    await this.eventsService.onQueryInstruments(instruments.length, { action: 'findAll' });
    return instruments;
  }

  async findOne(id: number): Promise<InstrumentEntity> {
    this.logger.info(`[QUERY] Buscando instrumento con ID=${id}`, 'InstrumentsService');
    const instrument = await this.instrumentRepository.findOne({ where: { id } });

    if (!instrument) {
      this.logger.warn(`[QUERY] Instrumento con ID=${id} no encontrado`, 'InstrumentsService');
      throw new NotFoundException(`Instrumento con ID ${id} no encontrado`);
    }

    this.logger.info(`[QUERY] Instrumento encontrado: "${instrument.nombre}"`, 'InstrumentsService');
    await this.eventsService.onQueryInstruments(1, { action: 'findOne', id });
    return instrument;
  }

  async findByTipo(tipo: string): Promise<InstrumentEntity[]> {
    this.logger.info(`[QUERY] Buscando instrumentos de tipo "${tipo}"`, 'InstrumentsService');
    const instruments = await this.instrumentRepository.find({ where: { tipo } });
    this.logger.info(`[QUERY] Se encontraron ${instruments.length} instrumento(s) de tipo "${tipo}"`, 'InstrumentsService');

    await this.eventsService.onQueryInstruments(instruments.length, { action: 'findByTipo', tipo });
    return instruments;
  }

  async update(id: number, updateInstrumentDto: UpdateInstrumentDto): Promise<InstrumentEntity> {
    this.logger.info(`[UPDATE] Iniciando actualización de instrumento ID=${id}`, 'InstrumentsService');
    const existingInstrument = await this.findOne(id);

    if (updateInstrumentDto.cantidad !== undefined && updateInstrumentDto.cantidad < 0) {
      this.logger.warn(`[UPDATE] Cantidad negativa rechazada en actualización ID=${id}`, 'InstrumentsService');
      throw new BadRequestException('La cantidad no puede ser negativa');
    }

    if (updateInstrumentDto.precio !== undefined && updateInstrumentDto.precio < 0) {
      this.logger.warn(`[UPDATE] Precio negativo rechazado en actualización ID=${id}`, 'InstrumentsService');
      throw new BadRequestException('El precio no puede ser negativo');
    }

    const before = { ...existingInstrument };
    Object.assign(existingInstrument, updateInstrumentDto);
    const updatedInstrument = await this.instrumentRepository.save(existingInstrument);

    this.logger.info(`[UPDATE] Instrumento ID=${id} actualizado correctamente`, 'InstrumentsService');
    await this.eventsService.onUpdateInstrument(before, updatedInstrument);
    return updatedInstrument;
  }

  async remove(id: number): Promise<InstrumentEntity> {
    this.logger.info(`[DELETE] Iniciando eliminación de instrumento ID=${id}`, 'InstrumentsService');
    const instrument = await this.findOne(id);
    await this.instrumentRepository.remove(instrument);

    this.logger.info(`[DELETE] Instrumento "${instrument.nombre}" eliminado`, 'InstrumentsService');
    await this.eventsService.onDeleteInstrument(instrument);
    return instrument;
  }

  async updateQuantity(id: number, quantityChange: number): Promise<InstrumentEntity> {
    this.logger.info(`[UPDATE] Ajuste de cantidad en ID=${id}: cambio=${quantityChange}`, 'InstrumentsService');
    const instrument = await this.findOne(id);
    const newQuantity = instrument.cantidad + quantityChange;

    if (newQuantity < 0) {
      this.logger.warn(`[UPDATE] Stock insuficiente en ID=${id}. Disponible=${instrument.cantidad}`, 'InstrumentsService');
      throw new BadRequestException(`No hay suficiente cantidad. Disponible: ${instrument.cantidad}`);
    }

    instrument.cantidad = newQuantity;
    const updatedInstrument = await this.instrumentRepository.save(instrument);

    this.logger.info(`[UPDATE] Cantidad de ID=${id} actualizada a ${newQuantity}`, 'InstrumentsService');
    await this.eventsService.onUpdateInstrument(instrument, updatedInstrument);
    return updatedInstrument;
  }

  async getInventorySummary(): Promise<any> {
    this.logger.info('[QUERY] Generando resumen de inventario', 'InstrumentsService');
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

    this.logger.info(`[QUERY] Resumen generado: ${instruments.length} instrumentos, valor total $${summary.totalValue}`, 'InstrumentsService');
    await this.eventsService.onQueryInstruments(instruments.length, { action: 'getInventorySummary' });
    return summary;
  }
}