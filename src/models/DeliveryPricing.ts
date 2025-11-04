import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { DeliveryLocation } from "./DeliveryLocation";

@Entity({ name: "delivery_pricing" })
export class DeliveryPricing {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => DeliveryLocation, (location) => location.originPricings)
  @JoinColumn({ name: "originLocationId" })
  originLocation!: DeliveryLocation;

  @ManyToOne(() => DeliveryLocation, (location) => location.destinationPricings)
  @JoinColumn({ name: "destinationLocationId" })
  destinationLocation!: DeliveryLocation;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  price!: number;

  @Column({ type: "varchar", length: 3, default: "TRY" })
  currency!: string;

  @Column({ type: "varchar", length: 20, default: "active" })
  status!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
