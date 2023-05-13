import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Media } from './media.entity';
import { MediaTypeEnum } from './enums/media.enum';
import { MediaFormatEnum } from './enums/media.enum';

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(Media)
    private readonly mediaRepository: Repository<Media>,
  ) {}

  createMedia(medianame: string, mediatimestamp:Date, mediafile: Blob): Promise<Media> {
    const media = new Media();
    media.mediaName = medianame;
    media.mediaTimeStamp = mediatimestamp;
    media.MediaFormat = MediaFormatEnum.FOTO;
    media.MediaType = MediaTypeEnum.AUFNAHME;
    media.mediaFile = mediafile;
    return this.mediaRepository.save(media);
  }

  // async getMediabyId(id: number): Promise<Media> {
  //   return await this.mediaRepository.findOne(id);
  // }

 

}

