import { Entity, Column, ManyToMany, OneToMany, ManyToOne } from "typeorm";
import { BaseModel } from "./BaseModel";
import { Product } from "./Product";
import type { Product as Producttype } from "./Product";

@Entity()
export class Category extends BaseModel {
  @Column({ type: "varchar", length: 255 })
  name!: string;

  @Column({ type: "varchar", length: 255, unique: true })
  slug!: string;

  @Column({ type: "int", nullable: true })
  parentId?: number | null;

  @ManyToOne(() => Category, (category) => category.subcategories, {
    nullable: true,
    onDelete: "SET NULL",
  })
  parent?: Category | null;

  @OneToMany(() => Category, (category) => category.parent)
  subcategories?: Category[];

  @OneToMany(() => Product, (product) => product.category)
  products!: Producttype[];
}
