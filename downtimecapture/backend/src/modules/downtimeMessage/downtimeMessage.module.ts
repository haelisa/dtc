import { Module } from '@nestjs/common';
import { AppController } from '../../app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QueryRunnerProviderAlreadyReleasedError } from 'typeorm';
import { DowntimeMessageService } from './downtimeMessage.service';
import { DowntimeMessage } from './downtimeMessage.entity';
import { DowntimeMessageController } from './downtimeMessage.controller';

@Module({
    
    imports:[TypeOrmModule.forFeature([DowntimeMessage])],
    providers: [DowntimeMessageService],
    controllers: [DowntimeMessageController],
})
export class DowntimeMessageModule {}