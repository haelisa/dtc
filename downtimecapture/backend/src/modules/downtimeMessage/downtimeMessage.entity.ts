import { Entity,Column, PrimaryGeneratedColumn, Timestamp, ManyToOne, OneToMany, JoinColumn } from "typeorm";
import { Media } from "../media/media.entity";
import { text } from "stream/consumers";

@Entity()

export class DowntimeMessage {

    @PrimaryGeneratedColumn()
    dtmId: number

    @Column({type: 'varchar', unique: true})
    eventID: string

    @Column({type: 'varchar'})
    equipmentNo : string

    @Column({type: 'int'})
    dtcTimeStampUnixEpoch : number

    @Column({type: 'varchar'})
    name : string

    @Column({type: 'varchar'})
    surname: string

    @ManyToOne(() => Media, (media) => media.downtimeMessages)
    @JoinColumn({name: 'mediaId' })
    media: Media;

    @Column({type: 'text', nullable: true})
    comment : string

    @Column({type: 'int'})
    mediaId : number
    
}