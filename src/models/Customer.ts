import { Entity, Column, OneToMany } from "typeorm";
import { BaseModel } from "./BaseModel";
import { Order } from "./Order";

@Entity()
export class Customer extends BaseModel {
  @Column({ type: "varchar", length: 255 })
  firstName!: string;

  @Column({ type: "varchar", length: 255 })
  lastName!: string;

  @Column({ type: "varchar", length: 255, unique: true })
  email!: string;

  @Column({ type: "varchar", length: 20, nullable: true })
  phoneNumber?: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  address?: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  city?: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  state?: string;

  @Column({ type: "varchar", length: 20, nullable: true })
  zipCode?: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  country?: string;

  @OneToMany(() => Order, (order) => order.customerId)
  orders!: Order[];
}
