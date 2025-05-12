import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { BaseModel } from "./BaseModel";
import { Event } from "./Event";

@Entity("ticket")
export class Ticket extends BaseModel {
  @ManyToOne(() => Event)
  @JoinColumn({ name: "eventId" })
  event!: Event;

  @Column()
  eventId!: number;

  @Column()
  userId!: number;

  @Column({ default: "regular" })
  ticketType!: string;

  @Column()
  price!: number;

  @Column()
  qrCode!: string;
}