import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import type { DaySchedule } from "../forms/shop";
import { BaseModel } from "./BaseModel";

@Entity()
export class Shop extends BaseModel {
  @PrimaryGeneratedColumn("uuid")
  @Column({ nullable: true })
  name!: string;

  @Column({ nullable: true })
  description!: string;

  @Column({ nullable: true })
  coverImageUrl!: string;

  @Column({ type: "jsonb" })
  schedule!: DaySchedule[];

  @Column({ default: "active" })
  status!: string;

}