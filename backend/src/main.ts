import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common/pipes';

async function bootstrap() {
  const PORT = process.env.PORT || 3001;
  const app = await NestFactory.create(AppModule, { cors: true });

  app.use(helmet());
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(PORT);
}
bootstrap();
