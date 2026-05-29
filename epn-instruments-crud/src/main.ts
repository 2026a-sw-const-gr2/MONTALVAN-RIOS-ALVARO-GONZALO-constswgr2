// MANTENIMIENTO PERFECTIVO — Jonathan Cuasapaz
// Documentación OpenAPI/Swagger en /api/docs

import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  // Swagger — documentación de API
  const config = new DocumentBuilder()
    .setTitle('Inventario de Instrumentos Musicales')
    .setDescription('API REST del CRUD de instrumentos — EPN FIS 2026')
    .setVersion('1.0')
    .addApiKey({ type: 'apiKey', name: 'X-FIS-EPN-KEY', in: 'header' }, 'X-FIS-EPN-KEY')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT ?? 3001;

  await app.listen(port, () => {
    console.log(`\n🎵 Servidor ejecutándose en http://localhost:${port}`);
    console.log(`🖥️  Interfaz gráfica en http://localhost:${port}`);
    console.log(`📚 Documentación Swagger en http://localhost:${port}/api/docs`);
    console.log(`📡 Event Manager en ${process.env.EVENT_MANAGER_URL ?? 'http://localhost:3000/events'}`);
    console.log(`🔐 API-Key requerida en cabecera X-FIS-EPN-KEY`);
    console.log('\n✅ Sistema listo\n');
  });
}

bootstrap();