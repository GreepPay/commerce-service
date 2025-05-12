import { Entity, Column } from "typeorm";
import { BaseModel } from "./BaseModel";

@Entity("event_category")
export class EventCategory extends BaseModel {
  @Column()
  name!: string;

  @Column({ type: "text", nullable: true })
  description?: string;
}