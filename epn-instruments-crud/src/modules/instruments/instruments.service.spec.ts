// MANTENIMIENTO PERFECTIVO — Jonathan Cuasapaz
// Suite de pruebas unitarias con Jest — valida reglas de negocio del CRUD

import { Test, TestingModule } from '@nestjs/testing';
import { InstrumentsService } from './instruments.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { InstrumentEntity } from '../../database/entities/instrument.entity';
import { EventsService } from '../events/events.service';
import { AppLogger } from '../../logger/app-logger.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

// Mock del repositorio TypeORM
const mockRepository = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  remove: jest.fn(),
};

// Mock del EventsService
const mockEventsService = {
  onCreateInstrument: jest.fn(),
  onUpdateInstrument: jest.fn(),
  onDeleteInstrument: jest.fn(),
  onQueryInstruments: jest.fn(),
};

// Mock del Logger
const mockLogger = {
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  info: jest.fn(),
};

describe('InstrumentsService — Pruebas Unitarias', () => {
  let service: InstrumentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InstrumentsService,
        { provide: getRepositoryToken(InstrumentEntity), useValue: mockRepository },
        { provide: EventsService, useValue: mockEventsService },
        { provide: AppLogger, useValue: mockLogger },
      ],
    }).compile();

    service = module.get<InstrumentsService>(InstrumentsService);
    jest.clearAllMocks();
  });

  // ─── CREATE ────────────────────────────────────────────────────────────────

  describe('create()', () => {
    it('debe crear un instrumento válido correctamente', async () => {
      const dto = { nombre: 'Guitarra', tipo: 'Cuerda', precio: 150, cantidad: 5 };
      const savedInstrument = { id: 1, ...dto };

      mockRepository.create.mockReturnValue(dto);
      mockRepository.save.mockResolvedValue(savedInstrument);

      const result = await service.create(dto as any);

      expect(mockRepository.create).toHaveBeenCalledWith(dto);
      expect(mockRepository.save).toHaveBeenCalled();
      expect(result.id).toBe(1);
      expect(mockEventsService.onCreateInstrument).toHaveBeenCalledWith(savedInstrument);
    });

    it('debe lanzar BadRequestException si cantidad es negativa', async () => {
      const dto = { nombre: 'Guitarra', tipo: 'Cuerda', precio: 100, cantidad: -1 };
      await expect(service.create(dto as any)).rejects.toThrow(BadRequestException);
      expect(mockRepository.save).not.toHaveBeenCalled();
    });

    it('debe lanzar BadRequestException si precio es negativo', async () => {
      const dto = { nombre: 'Flauta', tipo: 'Viento', precio: -50, cantidad: 2 };
      await expect(service.create(dto as any)).rejects.toThrow(BadRequestException);
      expect(mockRepository.save).not.toHaveBeenCalled();
    });

    it('debe aceptar precio igual a cero', async () => {
      const dto = { nombre: 'Tambor', tipo: 'Percusión', precio: 0, cantidad: 1 };
      const saved = { id: 2, ...dto };
      mockRepository.create.mockReturnValue(dto);
      mockRepository.save.mockResolvedValue(saved);

      const result = await service.create(dto as any);
      expect(result.id).toBe(2);
    });
  });

  // ─── READ ──────────────────────────────────────────────────────────────────

  describe('findAll()', () => {
    it('debe retornar todos los instrumentos', async () => {
      const instruments = [
        { id: 1, nombre: 'Guitarra', tipo: 'Cuerda' },
        { id: 2, nombre: 'Piano', tipo: 'Teclado' },
      ];
      mockRepository.find.mockResolvedValue(instruments);

      const result = await service.findAll();

      expect(result).toHaveLength(2);
      expect(mockEventsService.onQueryInstruments).toHaveBeenCalledWith(2, { action: 'findAll' });
    });

    it('debe retornar array vacío si no hay instrumentos', async () => {
      mockRepository.find.mockResolvedValue([]);
      const result = await service.findAll();
      expect(result).toHaveLength(0);
    });
  });

  describe('findOne()', () => {
    it('debe retornar el instrumento si existe', async () => {
      const instrument = { id: 1, nombre: 'Violín', tipo: 'Cuerda' };
      mockRepository.findOne.mockResolvedValue(instrument);

      const result = await service.findOne(1);
      expect(result.nombre).toBe('Violín');
    });

    it('debe lanzar NotFoundException si el ID no existe', async () => {
      mockRepository.findOne.mockResolvedValue(null);
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  // ─── UPDATE ────────────────────────────────────────────────────────────────

  describe('update()', () => {
    it('debe actualizar correctamente un instrumento existente', async () => {
      const existing = { id: 1, nombre: 'Guitarra', tipo: 'Cuerda', precio: 100, cantidad: 3 };
      const updateDto = { precio: 200 };
      const updated = { ...existing, precio: 200 };

      mockRepository.findOne.mockResolvedValue(existing);
      mockRepository.save.mockResolvedValue(updated);

      const result = await service.update(1, updateDto as any);
      expect(result.precio).toBe(200);
      expect(mockEventsService.onUpdateInstrument).toHaveBeenCalled();
    });

    it('debe lanzar BadRequestException si cantidad de actualización es negativa', async () => {
      const existing = { id: 1, nombre: 'Guitarra', tipo: 'Cuerda', precio: 100, cantidad: 3 };
      mockRepository.findOne.mockResolvedValue(existing);

      await expect(service.update(1, { cantidad: -5 } as any)).rejects.toThrow(BadRequestException);
    });
  });

  // ─── DELETE ────────────────────────────────────────────────────────────────

  describe('remove()', () => {
    it('debe eliminar un instrumento existente', async () => {
      const instrument = { id: 1, nombre: 'Trompeta', tipo: 'Viento' };
      mockRepository.findOne.mockResolvedValue(instrument);
      mockRepository.remove.mockResolvedValue(instrument);

      const result = await service.remove(1);
      expect(result.nombre).toBe('Trompeta');
      expect(mockEventsService.onDeleteInstrument).toHaveBeenCalledWith(instrument);
    });

    it('debe lanzar NotFoundException al eliminar ID inexistente', async () => {
      mockRepository.findOne.mockResolvedValue(null);
      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });

  // ─── STOCK ─────────────────────────────────────────────────────────────────

  describe('updateQuantity()', () => {
    it('debe sumar correctamente una entrada de stock', async () => {
      const instrument = { id: 1, nombre: 'Bajo', tipo: 'Cuerda', cantidad: 5 };
      const updated = { ...instrument, cantidad: 8 };
      mockRepository.findOne.mockResolvedValue(instrument);
      mockRepository.save.mockResolvedValue(updated);

      const result = await service.updateQuantity(1, 3);
      expect(result.cantidad).toBe(8);
    });

    it('debe lanzar BadRequestException si el resultado de stock es negativo', async () => {
      const instrument = { id: 1, nombre: 'Bajo', tipo: 'Cuerda', cantidad: 2 };
      mockRepository.findOne.mockResolvedValue(instrument);

      await expect(service.updateQuantity(1, -10)).rejects.toThrow(BadRequestException);
    });
  });
});