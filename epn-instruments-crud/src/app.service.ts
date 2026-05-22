import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): object {
    return {
      message: '🎵 Bienvenido al Sistema CRUD de Inventario de Instrumentos Musicales',
      version: '1.0.0',
      description: 'API RESTful para gestionar un inventario de instrumentos musicales',
      endpoints: {
        instruments: {
          create: 'POST /instruments',
          findAll: 'GET /instruments',
          findOne: 'GET /instruments/:id',
          findByType: 'GET /instruments/type/:tipo',
          update: 'PUT /instruments/:id',
          updateQuantity: 'PUT /instruments/:id/quantity?change=<number>',
          delete: 'DELETE /instruments/:id',
          summary: 'GET /instruments/summary',
        },
        health: 'GET /health',
      },
    };
  }

  getHealth(): object {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'epn-instruments-crud',
      version: '1.0.0',
    };
  }
}
