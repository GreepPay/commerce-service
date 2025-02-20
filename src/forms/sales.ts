import { SaleStatus, PaymentMethod } from "../models/Sale";

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface ProcessSaleRequest {
  customerId: string;
  items: CartItem[];
  discountCodes?: string[];
  paymentMethod: PaymentMethod;
  metadata?: Record<string, any>;
}

export interface RefundRequest {
  amount: number;
  reason: string;
  notes?: string;
}

export interface DiscountApplication {
  saleId: string;
  discountCode: string;
}

export interface TaxCalculationRequest {
  items: CartItem[];
  customerLocation?: {
    country: string;
    state: string;
    city: string;
    postalCode: string;
  };
}

export interface SaleFilters {
  customerId?: string;
  status?: SaleStatus;
  fromDate?: Date;
  toDate?: Date;
  minAmount?: number;
  maxAmount?: number;
}

export interface Discount {
  code: string;
  type: "percentage" | "fixed_amount";
  value: number;
  description: string;
  minPurchaseAmount?: number;
  maxDiscountAmount?: number;
  startDate?: Date;
  endDate?: Date;
  usageLimit?: number;
  currentUsage?: number;
  productIds?: string[]; // Specific products this discount applies to
  categoryIds?: string[]; // Specific categories this discount applies to
  customerIds?: string[]; // Specific customers who can use this discount
  metadata?: Record<string, any>;
}

export interface TaxRate {
  type: string;
  rate: number;
  description: string;
  locationRules?: {
    country?: string;
    state?: string;
    city?: string;
    postalCode?: string;
  };
  productTypes?: string[]; // Product types this tax applies to
  categoryIds?: string[]; // Product categories this tax applies to
  minAmount?: number; // Minimum amount for tax to apply
  maxAmount?: number; // Maximum amount for tax to apply
  metadata?: Record<string, any>;
}

export interface SaleItem {
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
}

export interface Sale {
  id: string;
  transactionId: string;
  customerId: string;
  items: SaleItem[];
  subtotalAmount: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  currency: string;
  status: SaleStatus;
  appliedDiscounts?: {
    code: string;
    type: "percentage" | "fixed_amount";
    value: number;
    description: string;
  }[];
  taxDetails?: {
    type: string;
    rate: number;
    amount: number;
    description: string;
  }[];
  paymentDetails: {
    method: PaymentMethod;
    transactionDate: Date;
    provider?: string;
    lastFourDigits?: string;
    receiptNumber?: string;
  };
  refundDetails?: {
    transactionId: string;
    amount: number;
    reason: string;
    status: "pending" | "completed" | "failed";
    refundDate: Date;
    notes?: string;
  }[];
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}
