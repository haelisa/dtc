import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Media } from './media.entity';

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(Media)
    private readonly mediaRepository: Repository<Media>,
  ) {}

  async createMedia(data: Partial<Media>): Promise<Media> {
    const media = await this.mediaRepository.create(data);
    return await this.mediaRepository.save(media);
  }

  findAll(): Promise<Media[]> {
    return this.mediaRepository.find();
  }

  //async getMediaById(id: number): Promise<Media> {
    //return await this.mediaRepository.findOne(id)
  //}
}

