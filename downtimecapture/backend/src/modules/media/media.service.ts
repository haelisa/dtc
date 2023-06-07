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

  createMedia(medianame: string, mediatimestamp:Date, mediaType: MediaTypeEnum, mediafile: Blob): Promise<Media> {
    const media = new Media();
    media.mediaName = medianame;
    media.mediaTimeStamp = mediatimestamp;
    media.MediaFormat = MediaFormatEnum.FOTO;
    media.MediaType = mediaType;
    media.mediaFile = mediafile;
    return this.mediaRepository.save(media);
  }

  getMediaFormatEnum(){
    return MediaFormatEnum;
  }

  getMediaTypeEnum(){
    return MediaTypeEnum;
  }

}