import { Entity,Column, PrimaryGeneratedColumn, Timestamp, ManyToOne, OneToMany } from "typeorm";
import { Media } from "../media/media.entity";
import { text } from "stream/consumers";

@Entity()

export class DowntimeMessage {

    @PrimaryGeneratedColumn()
    id: number

    @Column({type: 'varchar'})
    eventID: string

    @Column({type: 'varchar'})
    equipmentNo : string

    @Column({type: 'timestamp'})
    dtcTimeStamp : Timestamp

    @Column({type: 'varchar'})
    name : string

    @Column({type: 'varchar'})
    surename: string

    // @OneToMany(() => Media, (media) => media.mediaName)
    // media: Media

    @Column({type: 'text'})
    comment : string
}