import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Habilita CORS para permitir chamadas do frontend Angular
  app.enableCors();
  
  await app.listen(3000);
  console.log(`Backend rodando em: http://localhost:3000`);
}
bootstrap();
