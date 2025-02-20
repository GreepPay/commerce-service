import { Entity, Column, ManyToMany } from "typeorm";
import { BaseModel } from "./BaseModel";
import { Product } from "./Product";

@Entity()
export class Category extends BaseModel {
  @Column()
  name!: string;

  @Column({ unique: true })
  slug!: string;

  @ManyToMany(() => Product, (product) => product.categories)
  products!: Product[];
}
