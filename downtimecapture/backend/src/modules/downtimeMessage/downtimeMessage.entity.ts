import { Entity,Column, PrimaryGeneratedColumn, Timestamp, ManyToOne, OneToMany } from "typeorm";
import { Media } from "../media/media.entity";
import { text } from "stream/consumers";

@Entity()

export class DowntimeMessage {

    @PrimaryGeneratedColumn()
    id: number

    @Column({type: 'varchar', nullable: true})
    eventID: string

    @Column({type: 'varchar', nullable: true})
    equipmentNo : string

    @Column({type: 'int', nullable: true})
    dtcTimeStampUnixEpoch : number

    @Column({type: 'varchar', nullable: true})
    name : string

    @Column({type: 'varchar', nullable: true})
    surname: string

    @ManyToOne(() => Media, (media) => media.downtimeMessages)
    media: Media;

    @Column({type: 'text', nullable: true})
    comment : string
    dtcTimeStamp: number;
}