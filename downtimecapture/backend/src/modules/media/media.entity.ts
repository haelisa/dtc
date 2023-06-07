import { timeStamp } from "console";
import { Entity, Column, PrimaryGeneratedColumn, Timestamp, OneToMany } from "typeorm";
import { MediaFormatEnum } from './enums/media.enum';
import { MediaTypeEnum } from './enums/media.enum';
import { DowntimeMessage } from "../downtimeMessage/downtimeMessage.entity";

@Entity()

export class Media {

    @PrimaryGeneratedColumn()
    mediaId: number

    @Column({type: 'varchar', unique: false})
    mediaName: string

    @Column({type: 'datetime'})
    mediaTimeStamp: Date

    @Column( {type: 'enum', enum: MediaTypeEnum} )
    MediaType: MediaTypeEnum

    @Column( {type: 'enum', enum: MediaFormatEnum})
    MediaFormat: MediaFormatEnum
    
    @Column({type: 'longblob'})
    mediaFile: any
    
    @OneToMany(() => DowntimeMessage, (downtimeMessage) => downtimeMessage.media)
    downtimeMessages: DowntimeMessage[];

}

