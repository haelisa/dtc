import { Body, Controller, Post, Param, Get } from '@nestjs/common';

import { Media } from './media.entity';
import { MediaService } from './media.service';

@Controller('media')
export class MediaController {

    constructor(private mediaServices: MediaService){}

  @Post()
  async createMedia(@Body() data: Partial<Media>): Promise<Media> {
    return await this.mediaServices.createMedia(data);
  }

  @Get()
  findAll(): Promise<Media[]> {
    return this.mediaServices.findAll();
  }

  
}
