import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // * validation 오류 있으면 400 Bad Request 예외 발생
  app.useGlobalPipes(new ValidationPipe());

  // * swagger 세팅
  const config = new DocumentBuilder()
    .setTitle('Nest API')
    .setDescription('the description of the API')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api', app, document);

  const configService = app.get(ConfigService);
  const nestApplicationPort = configService.get<number>(
    'NEST_APPLICATION_PORT',
  );
  await app.listen(nestApplicationPort);
}
bootstrap();
