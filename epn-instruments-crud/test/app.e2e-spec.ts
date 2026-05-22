import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('InstrumentsController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET / - Info', () => {
    it('should return API info', () => {
      return request(app.getHttpServer())
        .get('/')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('message');
          expect(res.body).toHaveProperty('endpoints');
        });
    });
  });

  describe('GET /health - Health Check', () => {
    it('should return health status', () => {
      return request(app.getHttpServer())
        .get('/health')
        .expect(200)
        .expect((res) => {
          expect(res.body.status).toBe('ok');
        });
    });
  });

  describe('Instruments CRUD', () => {
    let createdInstrumentId: number;

    describe('POST /instruments', () => {
      it('should create a new instrument', () => {
        return request(app.getHttpServer())
          .post('/instruments')
          .send({
            nombre: 'Guitarra Clásica',
            tipo: 'Cuerda',
            marca: 'Yamaha',
            modelo: 'C40',
            precio: 200,
            cantidad: 10,
            descripcion: 'Guitarra clásica de buena calidad',
            condicion: 'Nuevo',
            ubicacion: 'Pasillo 1',
          })
          .expect(201)
          .expect((res) => {
            expect(res.body).toHaveProperty('id');
            expect(res.body.nombre).toBe('Guitarra Clásica');
            expect(res.body.tipo).toBe('Cuerda');
            createdInstrumentId = res.body.id;
          });
      });

      it('should fail with negative price', () => {
        return request(app.getHttpServer())
          .post('/instruments')
          .send({
            nombre: 'Instrumento Inválido',
            tipo: 'Cuerda',
            precio: -100,
            cantidad: 5,
          })
          .expect(400);
      });

      it('should fail with negative quantity', () => {
        return request(app.getHttpServer())
          .post('/instruments')
          .send({
            nombre: 'Instrumento Inválido',
            tipo: 'Cuerda',
            precio: 100,
            cantidad: -5,
          })
          .expect(400);
      });
    });

    describe('GET /instruments', () => {
      it('should return all instruments', () => {
        return request(app.getHttpServer())
          .get('/instruments')
          .expect(200)
          .expect((res) => {
            expect(Array.isArray(res.body)).toBe(true);
          });
      });
    });

    describe('GET /instruments/:id', () => {
      it('should return a specific instrument', () => {
        return request(app.getHttpServer())
          .get(`/instruments/${createdInstrumentId}`)
          .expect(200)
          .expect((res) => {
            expect(res.body.id).toBe(createdInstrumentId);
            expect(res.body.nombre).toBe('Guitarra Clásica');
          });
      });

      it('should return 404 for non-existent instrument', () => {
        return request(app.getHttpServer())
          .get('/instruments/99999')
          .expect(404);
      });
    });

    describe('PUT /instruments/:id', () => {
      it('should update an instrument', () => {
        return request(app.getHttpServer())
          .put(`/instruments/${createdInstrumentId}`)
          .send({
            cantidad: 15,
            condicion: 'Excelente',
          })
          .expect(200)
          .expect((res) => {
            expect(res.body.cantidad).toBe(15);
            expect(res.body.condicion).toBe('Excelente');
          });
      });
    });

    describe('PUT /instruments/:id/quantity', () => {
      it('should update quantity', () => {
        return request(app.getHttpServer())
          .put(`/instruments/${createdInstrumentId}/quantity?change=5`)
          .expect(200)
          .expect((res) => {
            expect(res.body.cantidad).toBe(20);
          });
      });

      it('should fail with insufficient quantity', () => {
        return request(app.getHttpServer())
          .put(`/instruments/${createdInstrumentId}/quantity?change=-100`)
          .expect(400);
      });
    });

    describe('GET /instruments/summary', () => {
      it('should return inventory summary', () => {
        return request(app.getHttpServer())
          .get('/instruments/summary')
          .expect(200)
          .expect((res) => {
            expect(res.body).toHaveProperty('totalInstruments');
            expect(res.body).toHaveProperty('totalValue');
            expect(res.body).toHaveProperty('instrumentsByType');
          });
      });
    });

    describe('DELETE /instruments/:id', () => {
      it('should delete an instrument', () => {
        return request(app.getHttpServer())
          .delete(`/instruments/${createdInstrumentId}`)
          .expect(204);
      });

      it('should return 404 after deletion', () => {
        return request(app.getHttpServer())
          .get(`/instruments/${createdInstrumentId}`)
          .expect(404);
      });
    });
  });
});
