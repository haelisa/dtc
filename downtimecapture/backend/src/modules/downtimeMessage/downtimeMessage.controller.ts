import { Body, Controller, Post, Param, Get } from '@nestjs/common';
import { DowntimeMessage } from './downtimeMessage.entity';
import { DowntimeMessageService } from './downtimeMessage.service';
import { MediaService } from '../media/media.service';
import { Media } from '../media/media.entity';
import { Timestamp } from 'typeorm';

@Controller('dtm')
export class DowntimeMessageController {
    constructor(
      private dtmServices: DowntimeMessageService,
      private mediaServices: MediaService,
    ){}
    
  // @Get(':id')
  // get(@Param() params) {
  //   return this.dtmServices.getDowntimeMessage(params.id);
  // }

  @Post('createDtm')
  async createDowntimeMessage(
    @Body('dtmComment') downtimeComment : string,
    @Body('dtmTimeStamp') downtimeTimeStamp : string, 
    @Body('dtmEquipmentNo') downtimeEquipmentNo : string,  
    @Body('dtmEventid') downtimeEventid : string, @Body('dtmName') downtimeName : string, 
    @Body('dtmSurname') downtimeSurname : string, @Body('mediaObject') mediaObject : Media ){
      
      var downtimeTimeStampUTC = parseInt(downtimeTimeStamp);
      const dtmObject = new DowntimeMessage();
      dtmObject.comment = downtimeComment;
      dtmObject.dtcTimeStampUnixEpoch = downtimeTimeStampUTC;
      dtmObject.equipmentNo = downtimeEquipmentNo;
      dtmObject.eventID = downtimeEventid;
      dtmObject.name = downtimeName;
      dtmObject.surname = downtimeSurname;

      const savedMedia = await this.mediaServices.createMedia(
        mediaObject.mediaName,
        mediaObject.mediaTimeStamp,
        mediaObject.MediaType,
        mediaObject.mediaFile
      );
      
      dtmObject.media = savedMedia;
      dtmObject.mediaId = savedMedia.mediaId;

      console.log('Dtm Controller funktioniert.' + ' DTM-mediaId: '+ dtmObject.mediaId +' Media-mediaId: '+ savedMedia.mediaId);

    return this.dtmServices.createDowntimeMessage(dtmObject);
  }


}