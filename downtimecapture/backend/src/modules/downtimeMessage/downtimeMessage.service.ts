import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Timestamp } from 'typeorm';
import { DowntimeMessage } from './downtimeMessage.entity';
import { Media } from '../media/media.entity';
import { EmbeddedMetadata } from 'typeorm/metadata/EmbeddedMetadata';

@Injectable()
export class DowntimeMessageService {
  constructor(@InjectRepository(DowntimeMessage)
  private readonly dtmRepository: Repository<DowntimeMessage>
  ){}
  

  getDowntimeMessageByEventId(eventId: string): Promise<DowntimeMessage> {
    return this.dtmRepository.findOne({ where: { eventID: eventId } });
  }


  createDowntimeMessage(dtmObject: DowntimeMessage): Promise<DowntimeMessage>{
    console.log('Dtm Service funktioniert.');
    return this.dtmRepository.save(dtmObject);
  }


  async checkEventID(eventID : string): Promise<boolean>{
    const downtimeMessage = await this.dtmRepository.findBy({ eventID });

    if (downtimeMessage.length != 0) {
      return true; // EventID exists in the database
    } else {
      return false; // EventID does not exist in the database
    }
  }

   
}