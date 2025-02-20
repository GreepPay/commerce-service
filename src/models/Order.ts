import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from "typeorm";
import { BaseModel } from "./BaseModel";
import { Customer } from "./Customer";
import { Product } from "./Product";
import { Delivery } from "./Delivery";
import { Sale } from "./Sale";

export enum OrderStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  PROCESSING = "processing",
  SHIPPED = "shipped",
  DELIVERED = "delivered",
  CANCELLED = "cancelled",
  REFUNDED = "refunded",
}

export enum PaymentStatus {
  PENDING = "pending",
  AUTHORIZED = "authorized",
  PAID = "paid",
  FAILED = "failed",
  REFUNDED = "refunded",
  PARTIALLY_REFUNDED = "partially_refunded",
}

@Entity()
export class Order extends BaseModel {
  @Column()
  orderNumber!: string;

  @ManyToOne(() => Customer)
  @JoinColumn()
  customer!: typeof Customer;

  @ManyToOne(() => Sale)
  @JoinColumn()
  sale!: typeof Sale;

  @Column("jsonb")
  items!: Array<{
    product: Product;
    quantity: number;
    price: number;
    taxRate: number;
    taxAmount: number;
    discountAmount: number;
    total: number;
  }>;

  @Column("decimal", { precision: 10, scale: 2 })
  subtotalAmount!: number;

  @Column("decimal", { precision: 10, scale: 2 })
  taxAmount!: number;

  @Column("decimal", { precision: 10, scale: 2 })
  discountAmount!: number;

  @Column("decimal", { precision: 10, scale: 2 })
  totalAmount!: number;

  @Column({ default: "NGN" })
  currency!: string;

  @Column({
    type: "enum",
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status!: OrderStatus;

  @Column({ nullable: true })
  shippingAddress?: string;

  @Column({ nullable: true })
  billingAddress?: string;

  @Column({ nullable: true })
  paymentMethod?: string;

  @Column({
    type: "enum",
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  paymentStatus!: PaymentStatus;

  @Column({ type: "jsonb", nullable: true })
  paymentDetails?: {
    transactionId: string;
    provider: string;
    method: string;
    amount: number;
    currency: string;
    status: string;
    timestamp: Date;
  };

  @Column("jsonb", { nullable: true })
  appliedDiscounts?: Array<{
    code: string;
    type: "percentage" | "fixed_amount";
    value: number;
    description: string;
  }>;

  @Column("jsonb", { nullable: true })
  taxDetails?: Array<{
    type: string;
    rate: number;
    amount: number;
    description: string;
  }>;

  @Column({ type: "jsonb", nullable: true })
  refundDetails?: {
    transactionId: string;
    amount: number;
    reason: string;
    status: string;
    timestamp: Date;
  };

  @OneToMany(() => Delivery, (delivery) => delivery.order)
  deliveries!: Delivery[];

  @Column({ type: "jsonb" })
  statusHistory!: Array<{
    status: OrderStatus;
    timestamp: Date;
    note?: string;
  }>;
}
