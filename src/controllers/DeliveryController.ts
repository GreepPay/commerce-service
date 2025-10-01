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
        { field: "type", type: "string", required: false }, // Add type validation
      ];

      const deliveryData = (await request.validate(
        validations
      )) as CreateDelivery;

      // Set default type for regular deliveries
      deliveryData.type = (deliveryData.type as "order" | "custom") || "order";

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

  /**
   * Create a custom delivery for chat-bot delivery system
   */
  async createCustomDelivery(request: BunRequest) {
    try {
      const validations: Validation[] = [
        { field: "customerId", type: "number", required: false },
        { field: "businessId", type: "number", required: false },
        { field: "itemDescription", type: "string", required: false },
        { field: "pickupAddress", type: "string", required: true },
        { field: "deliveryAddress", type: "string", required: true },
        { field: "urgency", type: "string", required: false },
        { field: "price", type: "number", required: true },
        { field: "estimatedDeliveryDate", type: "string", required: true },
        { field: "metadata", type: "object", required: false },
      ];

      const {
        customerId,
        businessId,
        itemDescription,
        pickupAddress,
        deliveryAddress,
        urgency,
        price,
        estimatedDeliveryDate,
        metadata,
      } = await request.validate(validations);

      const delivery = await this.deliveryService.createCustomDelivery({
        customerId,
        businessId,
        itemDescription,
        pickupAddress,
        deliveryAddress,
        urgency: urgency || "medium",
        price,
        estimatedDeliveryDate: new Date(estimatedDeliveryDate),
        metadata: metadata || {},
        type: "custom", // Explicitly set type as custom
      });

      return HttpResponse.success(
        "Custom delivery created successfully",
        delivery,
        201
      );
    } catch (error: any) {
      return HttpResponse.failure(
        error.message || "Failed to create custom delivery",
        error.status || 500
      );
    }
  }

  /**
   * Business accepts a custom delivery
   */
  async acceptDeliveryByBusiness(request: BunRequest) {
    try {
      const validations: Validation[] = [
        { field: "businessId", type: "number", required: true },
      ];

      const { id } = request.params;
      const { businessId } = await request.validate(validations);

      const delivery = await this.deliveryService.acceptDeliveryByBusiness(
        id,
        businessId
      );

      return HttpResponse.success(
        "Delivery accepted by business successfully",
        delivery
      );
    } catch (error: any) {
      return HttpResponse.failure(
        error.message || "Failed to accept delivery",
        error.status || 500
      );
    }
  }
}
