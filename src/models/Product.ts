import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { BaseModel } from "./BaseModel";

@Entity()
export class Product extends BaseModel {
  @Column()
  sku!: string;

  @Column()
  name!: string;

  @Column()
  description!: string;

  @Column()
  price!: number;

  @Column()
  currency?: string;

  @Column()
  taxCode?: string;

  @Column()
  type!: string;

  @Column({ default: "physical" })
  status!: string;
}
