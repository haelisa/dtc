import { Body, Controller, Post, Param, Get, UploadedFile, UseInterceptors } from '@nestjs/common';
import { Media } from './media.entity';
import { MediaService } from './media.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { MediaTypeEnum } from './enums/media.enum';


@Controller('media')
export class MediaController {

    constructor(private mediaServices: MediaService){}

  @Post('setMedia')
  //@UseInterceptors(FileInterceptor('mediafile'))
  async createMedia(@Body('mediaName') medianame: string, @Body('mediaTimeStamp') mediatimestamp: Date, 
    @Body('mediaType') mediaType: MediaTypeEnum, @Body('mediaFile') mediafile: Blob) {

    console.log('MediaController funktioniert')
    return this.mediaServices.createMedia(medianame, mediatimestamp, mediaType ,mediafile);
  }

  @Get('mediatype-enum')
  getMediaTypeEnum(){
    return this.mediaServices.getMediaTypeEnum();
  }

  @Get('mediaformat-enum')
  getMediaFormatEnum(){
    return this.mediaServices.getMediaFormatEnum();
  }

  // @Get()
  // findAll(): Promise<Media[]> {
  //   return this.mediaServices.findAll();
  // }

  
}
