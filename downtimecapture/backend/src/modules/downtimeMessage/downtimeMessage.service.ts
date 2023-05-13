import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Timestamp } from 'typeorm';
import { DowntimeMessage } from './downtimeMessage.entity';
import { Media } from '../media/media.entity';

@Injectable()
export class DowntimeMessageService {
  constructor(@InjectRepository(DowntimeMessage)
  private readonly dtmRepository: Repository<DowntimeMessage>,
  private readonly mediaRepository: Repository<Media>){}
  
  async getDowntimeMessage(_id: number): Promise<DowntimeMessage[]> {
    return await this.dtmRepository.find({
        select: ["eventID", "equipmentNo", "dtcTimeStampUnixEpoch", "name", "surname", "comment"],
        where: [{ "id": _id }]
    });
  }

  createDowntimeMessage(downtimeComment : string, downtimeEquipmentNo : string, downtimeEventid: string,
    downtimeTimeStampUTC: number, downtimeName: string ,downtimeSurname: string): Promise<DowntimeMessage>{
      console.log('Dtm Service funktioniert.');
      // var mediaObject = new Media();
      // const media = this.mediaRepository.findOne(mediaId);
      // if (!media) {
      //   throw new NotFoundException(`Media with id ${media} not found`);
      // }

      var dtm = new DowntimeMessage();
      dtm.dtcTimeStampUnixEpoch = downtimeTimeStampUTC;
      dtm.equipmentNo = downtimeEquipmentNo;
      dtm.eventID = downtimeEventid;
      dtm.comment = downtimeComment;
      dtm.name = downtimeName;
      dtm.surname = downtimeSurname;

      console.log(downtimeTimeStampUTC);
   
   return this.dtmRepository.save(dtm);
  }


  // async createMedia(data: Partial<DowntimeMessage>): Promise<DowntimeMessage> {
  //   const media = await this.mediaRepository.create(data);
  //   return await this.mediaRepository.save(media);
  // }

  // findAll(): Promise<DowntimeMessage[]> {
  //   return this.mediaRepository.find();
  // }

  // async getAllMedia(): Promise<DowntimeMessage[]> {
  //   return await this.mediaRepository.find();
  // }


     

}