import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { BaseModel, getEnumType, getJsonType } from "./BaseModel";
import type { Order } from "./Order";

export enum SaleStatus {
  PENDING = "pending",
  COMPLETED = "completed",
  REFUNDED = "refunded",
  PARTIALLY_REFUNDED = "partially_refunded",
  CANCELLED = "cancelled",
}

export enum PaymentMethod {
  CREDIT_CARD = "credit_card",
  DEBIT_CARD = "debit_card",
  BANK_TRANSFER = "bank_transfer",
  DIGITAL_WALLET = "digital_wallet",
  CASH = "cash",
}

@Entity()
export class Sale extends BaseModel {
  @Column({ type: "varchar", length: 255 })
  transactionId!: string;

  @Column()
  customerId!: number;

  @Column()
  businessId!: number;

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
    enum: SaleStatus,
    default: SaleStatus.PENDING,
  })
  status!: SaleStatus;

  @Column({ type: getJsonType() })
  items!: Array<{
    productId: string;
    sku: string;
    name: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
    taxRate: number;
    taxAmount: number;
    variantId?: string;
    discountAmount: number;
    total: number;
  }>;

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

  @Column({ type: getJsonType() })
  paymentDetails!: {
    method: PaymentMethod;
    transactionDate: Date;
    provider?: string;
    lastFourDigits?: string;
    receiptNumber?: string;
  };

  @Column({ type: getJsonType(), nullable: true })
  refundDetails?: Array<{
    transactionId: string;
    amount: number;
    reason: string;
    status: "pending" | "completed" | "failed";
    refundDate: Date;
    notes?: string;
  }>;

  @Column({ type: getJsonType(), nullable: true })
  metadata?: Record<string, any>;

  @Column({ type: "int", nullable: true })
  orderId?: number;

  @ManyToOne("Order", "sales", {
    nullable: true,
    onDelete: "SET NULL",
  })
  @JoinColumn()
  order?: Order;
}
