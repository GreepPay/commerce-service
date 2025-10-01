import { Delivery } from "../models/Delivery";
import { Order } from "../models/Order";
import { DeliveryStatus, type CreateDelivery } from "../forms/delivery";

export class DeliveryService {
  async createDelivery(deliveryData: CreateDelivery): Promise<Delivery> {
    const order = await Order.findOne({
      where: { id: parseInt(deliveryData.orderId) },
    });

    if (!order) {
      throw { status: 404, message: "Order not found" };
    }

    const delivery = Delivery.create();
    delivery.trackingNumber = deliveryData.trackingNumber;
    delivery.status = deliveryData.status;
    delivery.estimatedDeliveryDate = deliveryData.estimatedDeliveryDate;
    delivery.deliveryAddress = deliveryData.deliveryAddress;
    delivery.metadata = deliveryData.metadata;
    delivery.trackingUpdates = deliveryData.trackingUpdates;
    delivery.order = order;

    await delivery.save();
    return delivery;
  }

  /**
   * Creates a custom delivery for chat-bot delivery system
   * Uses admin-set fixed pricing
   */
  async createCustomDelivery(data: {
    customerId?: number;
    businessId?: number;
    itemDescription?: string;
    pickupAddress: string;
    deliveryAddress: string;
    urgency: "low" | "medium" | "high";
    price: number;
    estimatedDeliveryDate: Date;
    metadata: any;
  }): Promise<Delivery> {
    const trackingNumber = this.generateTrackingNumber();

    const delivery = Delivery.create();
    delivery.trackingNumber = trackingNumber;
    delivery.status = DeliveryStatus.PENDING;
    delivery.pickupAddress = data.pickupAddress;
    delivery.deliveryAddress = data.deliveryAddress;
    delivery.estimatedDeliveryDate = data.estimatedDeliveryDate;
    delivery.urgency = data.urgency;
    delivery.price = data.price;
    delivery.businessId = data.businessId;
    delivery.customerId = data.customerId;
    delivery.metadata = {
      ...data.metadata,
      source: "delivery-chat",
      itemDescription: data.itemDescription,
    };

    await delivery.save();
    return delivery;
  }

  /**
   * Business accepts delivery and updates businessId and status to confirmed
   */
  async acceptDeliveryByBusiness(
    deliveryId: string,
    businessId: number
  ): Promise<Delivery> {
    const delivery = await Delivery.findOne({
      where: { id: parseInt(deliveryId) },
    });

    if (!delivery) {
      throw { status: 404, message: "Delivery not found" };
    }

    // Check if delivery is in a state that can be accepted
    if (delivery.status !== DeliveryStatus.PENDING) {
      throw {
        status: 400,
        message: `Cannot accept delivery with status: ${delivery.status}. Only pending deliveries can be accepted.`,
      };
    }

    // Update businessId and status
    delivery.businessId = businessId;
    delivery.status = DeliveryStatus.CONFIRMED;

    // Add tracking update
    delivery.trackingUpdates = Array.isArray(delivery.trackingUpdates)
      ? delivery.trackingUpdates
      : [];

    delivery.trackingUpdates.push({
      timestamp: new Date(),
      status: DeliveryStatus.CONFIRMED,
      location: delivery.pickupAddress || "Business Location",
    });

    // Update metadata with acceptance info
    delivery.metadata = {
      ...delivery.metadata,
      acceptedAt: new Date(),
      acceptedByBusinessId: businessId,
    };

    await delivery.save();
    return delivery;
  }

  async updateDeliveryStatus(
    deliveryId: string,
    status: string
  ): Promise<Delivery> {
    const delivery = await Delivery.findOne({
      where: { id: parseInt(deliveryId) },
    });

    if (!delivery) {
      throw { status: 404, message: "Delivery not found" };
    }

    delivery.status = status;
    await delivery.save();
    return delivery;
  }

  async updateTrackingInformation(
    deliveryId: string,
    trackingInfo: any
  ): Promise<Delivery> {
    const delivery = await Delivery.findOne({
      where: { id: parseInt(deliveryId) },
    });

    if (!delivery) {
      throw { status: 404, message: "Delivery not found" };
    }

    delivery.trackingUpdates = Array.isArray(delivery.trackingUpdates)
      ? delivery.trackingUpdates
      : [];

    delivery.trackingUpdates.push(trackingInfo);
    await delivery.save();

    return delivery;
  }

  private generateTrackingNumber(): string {
    const prefix = "DEL";
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substr(2, 4).toUpperCase();
    return `${prefix}-${timestamp}-${random}`;
  }
}
