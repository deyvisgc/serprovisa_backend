import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // ignora parametros que no estan en mi dto,
    // forbidNonWhitelisted: true // alerta al ip que esta enviando un parametro que no existe
  }))
  app.enableCors();
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
