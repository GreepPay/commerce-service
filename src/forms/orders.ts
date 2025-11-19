import { OrderStatus, PaymentStatus } from "../models/Order";

export interface Order {
  customerId: number;
  saleId?: string;
  items: OrderItem[];
  shippingAddress?: Address;
  billingAddress?: Address;
  status?: OrderStatus;
  statusHistory?: StatusUpdate[];
  paymentMethod?: string;
  paymentStatus?: PaymentStatus;
  paymentDetails?: PaymentDetails;
  refundDetails?: RefundDetails;
  cancellationReason?: string;
  deliveryAddressId?: number;
  deliveryMethod?: string;
  refundId?: string;
  subtotalAmount?: number;
  taxAmount?: number;
  discountAmount?: number;
  totalAmount?: number;
  currency?: string;
  appliedDiscounts?: AppliedDiscount[];
  taxDetails?: TaxDetail[];
  isPreorder?: boolean;
}

export interface OrderItem {
  productId: string;
  sku: string;
  quantity: number;
  fulfilledQuantity?: number;
  price: number;
  taxRate?: number;
  taxAmount?: number;
  discountAmount?: number;
  total?: number;
  variantId?: string;
}

export interface StatusUpdate {
  status: OrderStatus;
  timestamp: Date;
  changedBy?: string;
  note?: string;
}

export interface PaymentDetails {
  transactionId: string;
  provider: string;
  method: string;
  amount: number;
  currency: string;
  status: string;
  timestamp: Date;
}

export interface RefundDetails {
  transactionId: string;
  amount: number;
  reason: string;
  status: string;
  timestamp: Date;
}

export interface AppliedDiscount {
  code: string;
  type: "percentage" | "fixed_amount";
  value: number;
  description: string;
}

export interface TaxDetail {
  type: string;
  rate: number;
  amount: number;
  description: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
}
