// MANTENIMIENTO ADAPTATIVO — Alvaro Montalvan
// Puerto leído desde variable de entorno .env

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  const port = process.env.PORT ?? 3001;

  await app.listen(port, () => {
    console.log(`\n🎵 Servidor ejecutándose en http://localhost:${port}`);
    console.log(`🖥️  Interfaz gráfica disponible en http://localhost:${port}`);
    console.log(`📡 Event Manager en ${process.env.EVENT_MANAGER_URL ?? 'http://localhost:3000/events'}`);
    console.log(`🔐 API-Key requerida en cabecera X-FIS-EPN-KEY`);
    console.log('\n✅ Sistema listo\n');
  });
}

bootstrap();