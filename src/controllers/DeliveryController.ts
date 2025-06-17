import { DeliveryService } from "../services/DeliveryService";
import HttpResponse from "../common/HttpResponse";
import type { BunRequest, Validation } from "../routes/router";
import type { CreateDelivery, Delivery } from "../forms/delivery";

export class DeliveryController {
  private deliveryService: DeliveryService;

  constructor() {
    this.deliveryService = new DeliveryService();
  }

  async createDelivery(request: BunRequest) {
    try {
      const validations: Validation[] = [
        { field: "orderId", type: "number", required: true },
        { field: "provider", type: "string", required: true },
        { field: "trackingNumber", type: "string", required: true },
        { field: "status", type: "string", required: true },
        { field: "estimatedDeliveryDate", type: "string", required: false },
      ];

      const deliveryData = (await request.validate(
        validations
      )) as CreateDelivery;

      const result = await this.deliveryService.createDelivery(deliveryData);

      return HttpResponse.success("Delivery created successfully", result, 201);
    } catch (error: any) {
      return HttpResponse.failure(
        error.message || "Failed to create delivery",
        error.status || 500
      );
    }
  }

  async updateDeliveryStatus(request: BunRequest) {
    try {
      const validations: Validation[] = [
        { field: "status", type: "string", required: true },
      ];

      const { id } = request.params;
      const { status } = (await request.validate(validations)) as Pick<
        CreateDelivery,
        "status"
      >;

      const result = await this.deliveryService.updateDeliveryStatus(
        id,
        status
      );

      return HttpResponse.success(
        "Updated Delivery Status successfully",
        result
      );
    } catch (error: any) {
      return HttpResponse.failure(
        error.message || "Failed to create delivery",
        error.status || 500
      );
    }
  }

  async updateTrackingInformation(request: BunRequest) {
    try {
      const { id } = request.params;
      const trackingInfo = await request.json();
      const result = await this.deliveryService.updateTrackingInformation(
        id,
        trackingInfo
      );
      return HttpResponse.success(
        "Updated Tranking Infomation successfully",
        result
      );
    } catch (error: any) {
      return HttpResponse.failure(
        error.message || "Failed to create delivery",
        error.status || 500
      );
    }
  }
}
