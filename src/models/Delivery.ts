import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { BaseModel, getDateTimeType, getJsonType } from "./BaseModel";
import type { Order as Ordertype } from "./Order";
import { Order } from "./Order";

@Entity()
export class Delivery extends BaseModel {
  @ManyToOne(() => Order, { nullable: true })
  @JoinColumn()
  order?: Ordertype;

  @Column({ type: "varchar", length: 255 })
  trackingNumber!: string;

  @Column({ type: "varchar", length: 50 })
  status!: string; // e.g., pending, shipped, delivered, failed

  @Column({ type: getDateTimeType() })
  estimatedDeliveryDate!: Date;

  @Column({ type: getDateTimeType(), nullable: true })
  actualDeliveryDate?: Date;

  @Column({ type: "varchar", length: 255 })
  deliveryAddress!: string;

  @Column({ type: getJsonType(), nullable: true })
  metadata?: Record<string, any>;

  @Column({ type: getJsonType(), nullable: true })
  trackingUpdates?: Array<{
    timestamp: Date;
    status: string;
    location?: string;
  }>;

  @Column({ type: getJsonType(), nullable: true })
  deliveryAttempts?: Array<{
    attemptDate: Date;
    status: string;
    notes?: string;
  }>;

  @Column({ type: "varchar", length: 255, nullable: true })
  pickupAddress?: string;

  @Column({ type: "varchar", length: 20, nullable: true })
  urgency?: string; // low, medium, high

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
  price?: number;

  @Column({ type: "int", nullable: true })
  businessId?: number;

  @Column({ type: "int", nullable: true })
  customerId?: number;
}
