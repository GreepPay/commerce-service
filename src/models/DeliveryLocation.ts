import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
// Avoid direct import to prevent circular dependency; use type-only import

@Entity({ name: "delivery_location" })
export class DeliveryLocation {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 100 })
  country!: string;

  @Column({ type: "varchar", length: 100 })
  area!: string;

  @Column({ type: "varchar", length: 20, default: "active" })
  status!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToMany(
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    () => require("./DeliveryPricing").DeliveryPricing,
    (pricing: any) => pricing.originLocation
  )
  originPricings!: any[];

  @OneToMany(
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    () => require("./DeliveryPricing").DeliveryPricing,
    (pricing: any) => pricing.destinationLocation
  )
  destinationPricings!: any[];
}
