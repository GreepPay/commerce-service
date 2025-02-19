export interface Order {
  id: string;
  customerId: string;
  saleId: string;
  items: OrderItem[];
  shippingAddress: Address;
  billingAddress: Address;
  status: OrderStatus;
  statusHistory: StatusUpdate[];
  cancellationReason?: string;
  refundId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  productId: string;
  sku: string;
  quantity: number;
  fulfilledQuantity: number; // For partial fulfillments
  priceSnapshot: number; // Price at time of purchase
}

export interface StatusUpdate {
  status: OrderStatus;
  changedAt: Date;
  changedBy: string; // System/user ID
  notes?: string;
}

// Enums
enum OrderStatus {
  DRAFT = "draft",
  CONFIRMED = "confirmed",
  PROCESSING = "processing",
  SHIPPED = "shipped",
  DELIVERED = "delivered",
  CANCELLED = "cancelled",
  RETURNED = "returned",
}

// Address Structure
export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
}
