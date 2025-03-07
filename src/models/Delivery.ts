import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { BaseModel } from "./BaseModel";
import { Order } from "./Order";

@Entity()
export class Delivery extends BaseModel {
  @ManyToOne(() => Order, { nullable: false })
  @JoinColumn()
  order!: typeof Order;

  @Column({ type: "varchar", length: 255 })
  trackingNumber!: string;

  @Column({ type: "varchar", length: 50 })
  status!: string; // e.g., pending, shipped, delivered, failed

  @Column({ type: "timestamp" })
  estimatedDeliveryDate!: Date;

  @Column({ type: "timestamp", nullable: true })
  actualDeliveryDate?: Date;

  @Column({ type: "varchar", length: 255 })
  deliveryAddress!: string;

  @Column({ type: "jsonb", nullable: true })
  metadata?: Record<string, any>;

  @Column({ type: "jsonb", nullable: true })
  trackingUpdates?: Array<{
    timestamp: Date;
    status: string;
    location?: string;
  }>;

  @Column({ type: "jsonb", nullable: true })
  deliveryAttempts?: Array<{
    attemptDate: Date;
    status: string;
    notes?: string;
  }>;
}