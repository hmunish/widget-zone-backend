import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get<ConfigService>(ConfigService);
  app.enableCors({
    origin: '*',
    exposedHeaders: configService.get<string[]>('exposeHeaders'),
    preflightContinue: true,
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
