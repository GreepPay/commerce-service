import { Entity, Column, OneToMany } from "typeorm";
import { BaseModel } from "./BaseModel";
import { Order } from "./Order";

@Entity()
export class Customer extends BaseModel {
  @Column()
  firstName!: string;

  @Column()
  lastName!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ nullable: true })
  phoneNumber?: string;

  @Column({ nullable: true })
  address?: string;

  @Column({ nullable: true })
  city?: string;

  @Column({ nullable: true })
  state?: string;

  @Column({ nullable: true })
  zipCode?: string;

  @Column({ nullable: true })
  country?: string;

  @OneToMany(() => Order, (order) => order.customer)
  orders!: Order[];
}
