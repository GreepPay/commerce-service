import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { BaseModel } from "./BaseModel";

// Import Order here but use it as a type later
import { Order } from "./Order";

@Entity()
export class Delivery extends BaseModel {
  @ManyToOne(() => Order, { nullable: false })
  @JoinColumn()
  order!: typeof Order;

  @Column()
  trackingNumber!: string;

  @Column()
  status!: string; // e.g., pending, shipped, delivered, failed

  @Column()
  estimatedDeliveryDate!: Date;

  @Column({ nullable: true })
  actualDeliveryDate?: Date;

  @Column()
  deliveryAddress!: string;

  @Column("jsonb", { nullable: true })
  metadata?: Record<string, any>;

  @Column("jsonb", { nullable: true })
  trackingUpdates?: Array<{
    timestamp: Date;
    status: string;
    location?: string;
  }>;

  @Column("jsonb", { nullable: true })
  deliveryAttempts?: Array<{
    attemptDate: Date;
    status: string;
    notes?: string;
  }>;
}
