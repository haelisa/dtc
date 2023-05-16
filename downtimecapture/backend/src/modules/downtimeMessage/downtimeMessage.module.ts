import { Module } from '@nestjs/common';
import { AppController } from '../../app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QueryRunnerProviderAlreadyReleasedError } from 'typeorm';
import { DowntimeMessageService } from './downtimeMessage.service';
import { DowntimeMessage } from './downtimeMessage.entity';
import { DowntimeMessageController } from './downtimeMessage.controller';
import { MediaService } from '../media/media.service';
import { MediaModule } from '../media/media.module';

@Module({
    
    imports:[TypeOrmModule.forFeature([DowntimeMessage]), MediaModule],
    providers: [DowntimeMessageService],
    controllers: [DowntimeMessageController],
})
export class DowntimeMessageModule {}