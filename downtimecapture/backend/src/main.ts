import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'reflect-metadata';
import * as moment from 'moment-timezone';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true
  });

  // app.enableCors({
  //   origin: ['from', 'to']
  // })

  // Setze die Zeitzone
  moment.tz.setDefault('Europe/Berlin');
  
  await app.listen(process.env.DB_PORT || 3000);
}
bootstrap();
