import { Body, Controller, Post, Param, Get } from '@nestjs/common';
import { DowntimeMessage } from './downtimeMessage.entity';
import { DowntimeMessageService } from './downtimeMessage.service';

@Controller('dtm')
export class DowntimeMessageController {
    constructor(private dtmServices: DowntimeMessageService){}
    

  @Get(':id')
  get(@Param() params) {
    return this.dtmServices.getDowntimeMessage(params.id);
  }

}