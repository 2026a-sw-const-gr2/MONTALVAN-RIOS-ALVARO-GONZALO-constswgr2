import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  const port = process.env.PORT || 3001;

  await app.listen(port, () => {
    console.log(
      `\n🎵 Servidor de Instrumentos ejecutándose en http://localhost:${port}`,
    );
    console.log(
      `🖥️  Interfaz gráfica disponible en http://localhost:${port}`,
    );
    console.log(
      `📡 Conectando con Event Manager en http://localhost:3000/events`,
    );
    console.log('\n✅ Sistema listo para recibir solicitudes CRUD\n');
  });
}

bootstrap();