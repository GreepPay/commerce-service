import { Delivery } from "../models/Delivery";
import { Order } from "../models/Order";
import type { CreateDelivery } from "../forms/delivery";

export class DeliveryService {
  async createDelivery(deliveryData: CreateDelivery): Promise<Delivery> {
    const delivery = new Delivery();

    const order = await Order.findOneByOrFail({
      id: parseInt(deliveryData.orderId),
    });
    delivery.order = order;

    Object.assign(delivery, {
      trackingNumber: deliveryData.trackingNumber,
      status: deliveryData.status,
      estimatedDeliveryDate: deliveryData.estimatedDeliveryDate,
      deliveryAddress: deliveryData.deliveryAddress,
      metadata: deliveryData.metadata,
      trackingUpdates: deliveryData.trackingUpdates,
      deliveryAttempts: deliveryData.deliveryAttempts,
    });

    await delivery.save();
    return delivery;
  }

  async updateDeliveryStatus(
    deliveryId: string,
    status: string
  ): Promise<Delivery> {
    const delivery = await Delivery.findOneBy({ id: parseInt(deliveryId) });
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
    const delivery = await Delivery.findOneBy({ id: parseInt(deliveryId) });
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
}
