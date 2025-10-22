import { Entity, Column, ManyToMany, OneToMany } from "typeorm";
import { BaseModel } from "./BaseModel";
import { Product } from "./Product";
import type { Product as Producttype } from "./Product";

@Entity()
export class Category extends BaseModel {
  @Column({ type: "varchar", length: 255 })
  name!: string;

  @Column({ type: "varchar", length: 255, unique: true })
  slug!: string;

  @OneToMany(() => Product, (product) => product.category)
  products!: Producttype[];
}
