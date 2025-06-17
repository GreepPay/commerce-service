import { DeliveryService } from "../services/DeliveryService";
import HttpResponse from "../common/HttpResponse";
import type { BunRequest, Validation } from "../routes/router";

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

      const deliveryData = (await request.validate(validations)) as {
        orderId: number;
        provider: string;
        trackingNumber: string;
        status: string;
        estimatedDeliveryDate?: string;
      };

      const result = await this.deliveryService.createDelivery(deliveryData);

      return HttpResponse.success("Delivery created successfully", result, 201);
    } catch (error: any) {
      return HttpResponse.failure(
        error.message || "Failed to create delivery",
        error.status || 500
      );
    }
  }

  async updateDeliveryStatus(request: BunRequest): Promise<Response> {
    try {
      const { id } = request.params;
      const { status } = (await request.json()) as { status: string }; // Ensure status is typed
      const result = await this.deliveryService.updateDeliveryStatus(
        id,
        status
      );
      return new Response(JSON.stringify(result), {
        status: result.statusCode,
      });
    } catch (error) {
      return new Response(
        JSON.stringify(
          HttpResponse.failure("Failed to update delivery status", 400)
        ),
        { status: 400 }
      );
    }
  }

  async updateTrackingInformation(request: BunRequest): Promise<Response> {
    try {
      const { id } = request.params;
      const trackingInfo = await request.json();
      const result = await this.deliveryService.updateTrackingInformation(
        id,
        trackingInfo
      );
      return new Response(JSON.stringify(result), {
        status: result.statusCode,
      });
    } catch (error) {
      return new Response(
        JSON.stringify(
          HttpResponse.failure("Failed to update tracking information", 400)
        ),
        { status: 400 }
      );
    }
  }
}
