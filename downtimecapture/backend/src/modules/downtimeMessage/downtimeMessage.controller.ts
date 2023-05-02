import { Body, Controller, Post, Param, Get } from '@nestjs/common';
import { DowntimeMessage } from './downtimeMessage.entity';
import { DowntimeMessageService } from './downtimeMessage.service';

@Controller('media')
export class DowntimeMessageController {
    constructor(private mediaServices: DowntimeMessageService){}
    
@Get()
  getHello(): string {
    return 'Hello World!';
  }

@Get('media')
  async getAllMedia(): Promise<DowntimeMessage[]> {
    return await this.mediaServices.getAllMedia();
  }

  //@Get('media/:id')
  //async getMediaById(@Param('id') id: number): Promise<Media> {
    //return await this.mediaServices.getMediaById(id);
  //}

  @Post('media')
  async createMedia(@Body() data: Partial<DowntimeMessage>): Promise<DowntimeMessage> {
    return await this.mediaServices.createMedia(data);
  }
}