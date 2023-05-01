import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FORMERR } from 'dns';

@Module({
  imports: [
    // ConfigModule.forRoot({isGlobal:true}),
    // TypeOrmModule.forRoot({
    //   type: 'mysql',
    //   url: process.env.DATABASE_URL,
    //   autoLoadEntities:true,
    //   synchronize:true
    // })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
