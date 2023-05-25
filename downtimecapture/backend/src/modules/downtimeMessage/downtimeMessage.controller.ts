import { Body, Controller, Post, Param, Get, Query } from '@nestjs/common';
import { DowntimeMessage } from './downtimeMessage.entity';
import { DowntimeMessageService } from './downtimeMessage.service';
import { MediaService } from '../media/media.service';
import { Media } from '../media/media.entity';
import { Timestamp } from 'typeorm';
import * as moment from 'moment-timezone';

@Controller('dtm')
export class DowntimeMessageController {
    constructor(
      private dtmServices: DowntimeMessageService,
      private mediaServices: MediaService,
    ){}


  @Get('checkEventID/:eventid')
  async getEventID(@Param('eventid') eventid: string) {
    return this.dtmServices.checkEventID(eventid);
  }  
    
  

   @Get('event/:eventId')
  getDowntimeMessageByEventId(@Param('eventId') eventId: string) {
    return this.dtmServices.getDowntimeMessageByEventId(eventId);
  }


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

      const timezone = 'Europe/Berlin'; // The desired time zone
      //  Convent the passed MediaTimeStamp to the desired time zone
      const momentObj = moment(mediaObject.mediaTimeStamp);
      const parsedMediaTimeStamp = momentObj.tz(timezone).toDate();

      const savedMedia = await this.mediaServices.createMedia(
        mediaObject.mediaName,
        parsedMediaTimeStamp,
        mediaObject.MediaType,
        mediaObject.mediaFile
      );
      
      dtmObject.media = savedMedia;
      dtmObject.mediaId = savedMedia.mediaId;

      console.log('Dtm Controller funktioniert.' + ' \nDTM-mediaId: '+ dtmObject.mediaId +' Media-mediaId: '+ savedMedia.mediaId + ' \nMediaTimeStamp: ' + parsedMediaTimeStamp);

    return this.dtmServices.createDowntimeMessage(dtmObject);
  }


}