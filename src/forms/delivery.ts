export interface Delivery {
  id: string;
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

// Enums
export enum DeliveryStatus {
  LABEL_CREATED = "label_created",
  IN_TRANSIT = "in_transit",
  OUT_FOR_DELIVERY = "out_for_delivery",
  DELIVERED = "delivered",
  FAILED_ATTEMPT = "failed_attempt",
  RETURN_TO_SENDER = "return_to_sender",
}
