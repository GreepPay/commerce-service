// Enums
export enum DeliveryStatus {
  // Initial states
  PENDING = "pending",
  PROCESSING = "processing",
  LABEL_CREATED = "label_created",

  // Shipping states
  SHIPPED = "shipped",
  IN_TRANSIT = "in_transit",
  OUT_FOR_DELIVERY = "out_for_delivery",

  // Final states
  DELIVERED = "delivered",

  // Exception states
  FAILED = "failed",
  FAILED_ATTEMPT = "failed_attempt",
  RETURNED = "returned",
  RETURN_TO_SENDER = "return_to_sender",
}

export interface Delivery {
  orderId: string;
  carrier: Carrier;
  trackingNumber: string;
  status: DeliveryStatus;
  estimatedDelivery: Date;
  actualDelivery?: Date;
  deliveryAttempts: number;
  trackingUpdates: TrackingEvent[];
  recipientSignature?: string; // Base64 encoded image
}

export interface Carrier {
  name: string; // e.g., "UPS", "DHL"
  serviceLevel: string; // e.g., "Express", "Standard"
  trackingUrlTemplate: string;
}

export interface TrackingEvent {
  timestamp: Date;
  location: string;
  status: DeliveryStatus;
  description: string;
  carrierCode?: string; // Original carrier status code
}

export interface CreateDelivery {
  metadata: any;
  deliveryAddress: any;
  orderId: string;
  carrier: Carrier;
  trackingNumber: string;
  status: DeliveryStatus;
  estimatedDeliveryDate: Date;
  actualDelivery?: Date;
  deliveryAttempts: number;
  trackingUpdates: TrackingEvent[];
  recipientSignature?: string;
}