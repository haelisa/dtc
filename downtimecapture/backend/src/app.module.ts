import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FORMERR } from 'dns';
import { Media } from './modules/media/media.entity';
import { DowntimeMessage } from './modules/downtimeMessage/downtimeMessage.entity';
import { MediaModule } from './modules/media/media.module';
import { DowntimeMessageModule } from './modules/downtimeMessage/downtimeMessage.module';
import { join } from 'path';


@Module({
  imports: [
    TypeOrmModule.forRoot(
      {
        "type": "mysql",
        "host": "localhost",
        "port": 3306,
        "username": "root",
        "password": "root",
        "database": "downtimecapture",
        "entities": [join(__dirname, '**', '*.entity.{ts,js}')],
        "synchronize": true
      }
    ),
    MediaModule, 
    DowntimeMessageModule
  ],
  controllers: [AppController],
  providers: [AppService]
})

export class AppModule {}
