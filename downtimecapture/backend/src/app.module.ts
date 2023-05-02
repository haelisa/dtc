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


@Module({
  imports: [
    TypeOrmModule.forRoot({
      // type: 'mysql',
      // url: process.env.DATABASE_URL,
      // host: process.env.DB_HOST,
      // port: parseInt(process.env.DB_PORT),
      // username: process.env.DB_USERNAME,
      // database: process.env.DATABASE,
      // entities: [Media, DowntimeMessage],
      // synchronize: true,
      // autoLoadEntities: true,
      // password: process.env.DB_PASSWORD

      type: 'mysql',
      host: 'localhost'
    
    }),
    MediaModule, 
    DowntimeMessageModule
  ],
  controllers: [AppController],
  providers: [AppService]
})

export class AppModule {}
