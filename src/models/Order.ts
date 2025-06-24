import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from "typeorm";
import { BaseModel, getEnumType, getJsonType } from "./BaseModel";
import { Customer } from "./Customer";
import type { Customer as Customertype } from "./Customer";
import { Product } from "./Product";
import { Delivery } from "./Delivery";
import type { Delivery as Deliverytype } from "./Delivery";
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
  @Column({ type: "varchar", length: 255 })
  orderNumber!: string;

  @Column()
  customerId!: number;

  @OneToMany(() => Sale, (sale) => sale.order, {
    cascade: false,
  })
  sales!: Sale[];

  @Column({ type: getJsonType() })
  items!: Array<{
    product: Product;
    quantity: number;
    price: number;
    taxRate: number;
    taxAmount: number;
    discountAmount: number;
    total: number;
  }>;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  subtotalAmount!: number;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  taxAmount!: number;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  discountAmount!: number;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  totalAmount!: number;

  @Column({ type: "varchar", length: 3, default: "NGN" })
  currency!: string;

  @Column({
    type: getEnumType(),
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status!: OrderStatus;

  @Column({ type: "varchar", length: 255, nullable: true })
  shippingAddress?: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  billingAddress?: string;

  @Column({ type: "varchar", length: 50, nullable: true })
  paymentMethod?: string;

  @Column({
    type: getEnumType(),
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  paymentStatus!: PaymentStatus;

  @Column({ type: getJsonType(), nullable: true })
  paymentDetails?: {
    transactionId: string;
    provider: string;
    method: string;
    amount: number;
    currency: string;
    status: string;
    timestamp: Date;
  };

  @Column({ type: getJsonType(), nullable: true })
  appliedDiscounts?: Array<{
    code: string;
    type: "percentage" | "fixed_amount";
    value: number;
    description: string;
  }>;

  @Column({ type: getJsonType(), nullable: true })
  taxDetails?: Array<{
    type: string;
    rate: number;
    amount: number;
    description: string;
  }>;

  @Column({ type: getJsonType(), nullable: true })
  refundDetails?: {
    transactionId: string;
    amount: number;
    reason: string;
    status: string;
    timestamp: Date;
  };

  @OneToMany(() => Delivery, (delivery) => delivery.order)
  deliveries!: Deliverytype[];

  @Column({ type: getJsonType() })
  statusHistory!: Array<{
    status: OrderStatus;
    timestamp: Date;
    note?: string;
  }>;
}
