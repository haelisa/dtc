import { Body, Controller, Post, Param, Get, UploadedFile, UseInterceptors } from '@nestjs/common';
import { Media } from './media.entity';
import { MediaService } from './media.service';
import { FileInterceptor } from '@nestjs/platform-express';


@Controller('media')
export class MediaController {

    constructor(private mediaServices: MediaService){}

  @Post('setMedia')
  //@UseInterceptors(FileInterceptor('mediafile'))
  async createMedia(@Body('mediaName') medianame: string, @Body('mediaTimeStamp') mediatimestamp: string, @Body('mediaFile') mediafile: Blob ) {
    // const mediatimestampDATE = new Date(mediatimestamp)
    // return this.mediaServices.createMedia(medianame, mediatimestampDATE, mediafile);
    const mediatimestampDATE = new Date(mediatimestamp);
    console.log('MediaController funktioniert')
    return this.mediaServices.createMedia(medianame, mediatimestampDATE, mediafile);
  }

  // @Get()
  // findAll(): Promise<Media[]> {
  //   return this.mediaServices.findAll();
  // }

  
}
