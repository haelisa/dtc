import { Body, Controller, Post, Param, Get } from '@nestjs/common';
import { DowntimeMessage } from './downtimeMessage.entity';
import { DowntimeMessageService } from './downtimeMessage.service';
import { Timestamp } from 'typeorm';

@Controller('dtm')
export class DowntimeMessageController {
    constructor(private dtmServices: DowntimeMessageService){}
    
  @Get(':id')
  get(@Param() params) {
    return this.dtmServices.getDowntimeMessage(params.id);
  }

  @Post('createDtm')
  async createDowntimeMessage(@Body('dtmComment') downtimeComment : string,@Body('dtmTimeStamp') downtimeTimeStamp : string, @Body('dtmEquipmentNo') downtimeEquipmentNo : string,  
    @Body('dtmEventid') downtimeEventid : string, @Body('dtmName') downtimeName : string, @Body('dtmSurname') downtimeSurname : string,){
      var downtimeTimeStampUTC = parseInt(downtimeTimeStamp);
      const dtmObject = new DowntimeMessage();     
      console.log('Dtm Controller funktioniert.' + downtimeTimeStamp + downtimeTimeStampUTC);

    return this.dtmServices.createDowntimeMessage(downtimeComment, downtimeEquipmentNo, downtimeEventid, downtimeTimeStampUTC, downtimeName,downtimeSurname);
  }


}