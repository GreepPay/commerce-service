import { Delivery } from "../models/Delivery";
import HttpResponse, { type HttpResponseType } from "../common/HttpResponse";

export class DeliveryService {

  async createDelivery(deliveryData: any): Promise<Delivery> {
    
    const delivery = new Delivery();

    Object.assign(delivery, deliveryData);

    await delivery.save();

    return delivery;
  }

  async updateDeliveryStatus(
    deliveryId: string,
    status: string
  ): Promise<HttpResponseType> {
    try {
      const delivery = await Delivery.findOneBy({ id: deliveryId });
      if (!delivery) {
        return HttpResponse.notFound("Delivery not found");
      }

      delivery.status = status;
      await delivery.save();
      return HttpResponse.success(
        "Delivery status updated successfully",
        delivery
      );
    } catch (error) {
      return HttpResponse.failure("Failed to update delivery status", 400);
    }
  }

  async updateTrackingInformation(
    deliveryId: string,
    trackingInfo: any
  ): Promise<HttpResponseType> {
    try {
      const delivery = await Delivery.findOneBy({ id: deliveryId });
      if (!delivery) {
        return HttpResponse.notFound("Delivery not found");
      }

      delivery.trackingUpdates = delivery.trackingUpdates || [];
      delivery.trackingUpdates.push(trackingInfo);
      await delivery.save();

      return HttpResponse.success(
        "Tracking information updated successfully",
        delivery
      );
    } catch (error) {
      return HttpResponse.failure("Failed to update tracking information", 400);
    }
  }
}
