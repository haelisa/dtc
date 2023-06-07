import { Module } from '@nestjs/common';
import { AppController } from '../../app.controller';
import { Media } from './media.entity'
import { TypeOrmModule } from '@nestjs/typeorm';
import { QueryRunnerProviderAlreadyReleasedError } from 'typeorm';
import { MediaService } from './media.service';
import { MediaController } from './media.controller';

@Module({
    
    imports:[TypeOrmModule.forFeature([Media])],
    providers: [MediaService],
    controllers: [MediaController],
    exports: [MediaService]
})

export class MediaModule {}