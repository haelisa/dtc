import { Entity,Column, PrimaryGeneratedColumn, Timestamp } from "typeorm";

@Entity()

export class DowntimeMessage {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    eventID: string

    @Column()
    equipmentNo : string

    @Column()
    dtcTimeStamp : Timestamp

    @Column()
    name : string

    @Column()
    surename: string

    @Column()
    media: Media

    @Column()
    comment : string
}