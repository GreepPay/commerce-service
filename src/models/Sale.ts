import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { BaseModel } from "./BaseModel";
import { Customer } from "./Customer";

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
  @Column()
  transactionId!: string;

  @ManyToOne(() => Customer)
  @JoinColumn()
  customer!: typeof Customer;

  @Column()
  customerId!: string;

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
    enum: SaleStatus,
    default: SaleStatus.PENDING,
  })
  status!: SaleStatus;

  @Column("jsonb")
  items!: Array<{
    productId: string;
    sku: string;
    name: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
    taxRate: number;
    taxAmount: number;
    discountAmount: number;
    total: number;
  }>;

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

  @Column("jsonb")
  paymentDetails!: {
    method: PaymentMethod;
    transactionDate: Date;
    provider?: string;
    lastFourDigits?: string;
    receiptNumber?: string;
  };

  @Column("jsonb", { nullable: true })
  refundDetails?: Array<{
    transactionId: string;
    amount: number;
    reason: string;
    status: "pending" | "completed" | "failed";
    refundDate: Date;
    notes?: string;
  }>;

  @Column("jsonb", { nullable: true })
  metadata?: Record<string, any>;
}
