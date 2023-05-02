import { timeStamp } from "console";
import { Entity, Column, PrimaryGeneratedColumn, Timestamp } from "typeorm";
import { MediaFormatEnum } from './enums/media.enum';
import { MediaTypeEnum } from './enums/media.enum';


@Entity()

export class Media {

    @PrimaryGeneratedColumn()
    id: number

    @Column({type: 'varchar', unique: true})
    mediaName: string

    @Column({type: 'timestamp'})
    mediaTimeStamp: Date

    @Column( {type: 'enum', enum: MediaTypeEnum} )
    MediaType: MediaTypeEnum

    @Column( {type: 'enum', enum: MediaFormatEnum})
    MediaFormat: MediaFormatEnum
    
    //@Column()
    //mediaFile: Blob
}

