import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { BaseModel } from "./BaseModel";
import { EventCategory } from "./EventCategory";

@Entity("event")
export class Event extends BaseModel {

  @Column()
  title!: string;

  @Column()
  userId!: number;

  @ManyToOne(() => EventCategory)
  @JoinColumn({ name: "categoryId" })
  category!: EventCategory;

  @Column()
  categoryId!: number;

  @Column({ type: "text", nullable: true })
  description?: string;

  @Column()
  location!: string;

  @Column({ type: "date" })
  date!: string;

  @Column({ type: "time" })
  startTime!: string;

  @Column({ type: "time" })
  endTime!: string;

  @Column()
  organizer!: string;

  @Column()
  price!: number;
}
