import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Timestamp } from 'typeorm';
import { DowntimeMessage } from './downtimeMessage.entity';
import { Media } from '../media/media.entity';

@Injectable()
export class DowntimeMessageService {
  constructor(@InjectRepository(DowntimeMessage)
  private readonly dtmRepository: Repository<DowntimeMessage>
  ){}
  
  // async getDowntimeMessage(_id: number): Promise<DowntimeMessage[]> {
  //   return await this.dtmRepository.find({
  //       select: ["eventID", "equipmentNo", "dtcTimeStampUnixEpoch", "name", "surname", "comment"],
  //       where: [{ "mediaId": _id }]
  //   });
  // }

  createDowntimeMessage(dtmObject: DowntimeMessage): Promise<DowntimeMessage>{
    console.log('Dtm Service funktioniert.');
    return this.dtmRepository.save(dtmObject);
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