import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DowntimeMessage } from './downtimeMessage.entity';

@Injectable()
export class DowntimeMessageService {
  constructor(@InjectRepository(DowntimeMessage) private dtmRepository: Repository<DowntimeMessage>) {} //readonly
  
  async getDowntimeMessage(_id: number): Promise<DowntimeMessage[]> {
    return await this.dtmRepository.find({
        select: ["eventID", "equipmentNo", "dtcTimeStamp", "name", "surename", "comment"],
        where: [{ "id": _id }]
    });
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