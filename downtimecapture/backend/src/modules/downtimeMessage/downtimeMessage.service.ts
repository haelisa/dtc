import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DowntimeMessage } from './downtimeMessage.entity';

@Injectable()
export class DowntimeMessageService {
  constructor(
    @InjectRepository(DowntimeMessage)
    private readonly mediaRepository: Repository<DowntimeMessage>,
  ) {}

  async createMedia(data: Partial<DowntimeMessage>): Promise<DowntimeMessage> {
    const media = await this.mediaRepository.create(data);
    return await this.mediaRepository.save(media);
  }

  findAll(): Promise<DowntimeMessage[]> {
    return this.mediaRepository.find();
  }

  async getAllMedia(): Promise<DowntimeMessage[]> {
    return await this.mediaRepository.find();
  }
}