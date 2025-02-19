import type { ProductType } from "./products";

// Core Transaction Model
export interface Sale {
  id: string; // UUID
  transactionId: string; // Payment gateway reference
  customerId: string;
  orderId: string; // Linked Order
  items: SaleItem[];
  subtotal: number;
  discounts: AppliedDiscount[];
  taxes: TaxDetail[];
  total: number;
  paymentMethod: PaymentMethod;
  currency: string; // ISO 4217
  status: SaleStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface SaleItem {
  productId: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  itemType: ProductType; // Physical/digital/subscription
  taxRate: number;
}

export interface AppliedDiscount {
  code: string;
  type: "percentage" | "fixed" | "bogo";
  value: number;
  appliesTo: "order" | "specific_items";
  description: string;
}

export interface TaxDetail {
  jurisdiction: string; // State/Country code
  rate: number;
  amount: number;
  taxType: "vat" | "gst" | "sales_tax";
}

// Invoice Model
export interface Invoice {
  id: string;
  saleId: string;
  invoiceNumber: string;
  issueDate: Date;
  dueDate?: Date;
  lineItems: InvoiceLineItem[];
  paymentStatus: "paid" | "pending" | "overdue";
  pdfUrl?: string; // Generated invoice PDF
}

export interface InvoiceLineItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

// Enums
enum PaymentMethod {
  CREDIT_CARD = "credit_card",
  PAYPAL = "paypal",
  BANK_TRANSFER = "bank_transfer",
}

enum SaleStatus {
  PENDING = "pending",
  COMPLETED = "completed",
  REFUNDED = "refunded",
  FAILED = "failed",
}
