import { Body, Controller, Post, Param, Get, UploadedFile, UseInterceptors } from '@nestjs/common';
import { Media } from './media.entity';
import { MediaService } from './media.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { MediaTypeEnum } from './enums/media.enum';

@Controller('media')
export class MediaController {

  constructor(private mediaServices: MediaService){}

 // Der MediaController wird von keiner Anfragemethode (HTTP-Request) aufgerufen.
  
}
