import { DeliveryService } from "../services/DeliveryService";
import HttpResponse from "../common/HttpResponse";
import type { BunRequest } from "../routes/router";

export class DeliveryController {
  private deliveryService: DeliveryService;

  constructor() {
    this.deliveryService = new DeliveryService();
  }

  async createDelivery(request: BunRequest): Promise<Response> {
    try {
      const deliveryData = await request.json();
      const result = await this.deliveryService.createDelivery(deliveryData);
      return new Response(JSON.stringify(result), { status: result.statusCode });
    } catch (error) {
      return new Response(
        JSON.stringify(HttpResponse.failure("Failed to create delivery", 400)),
        { status: 400 }
      );
    }
  }

  async updateDeliveryStatus(request: BunRequest): Promise<Response> {
    try {
      const { id } = request.params;
      const { status } = await request.json() as { status: string }; // Ensure status is typed
      const result = await this.deliveryService.updateDeliveryStatus(id, status);
      return new Response(JSON.stringify(result), { status: result.statusCode });
    } catch (error) {
      return new Response(
        JSON.stringify(HttpResponse.failure("Failed to update delivery status", 400)),
        { status: 400 }
      );
    }
  }

  async getDeliveryDetails(request: BunRequest): Promise<Response> {
    try {
      const { id } = request.params;
      const result = await this.deliveryService.getDeliveryDetails(id);
      return new Response(JSON.stringify(result), { status: result.statusCode });
    } catch (error) {
      return new Response(
        JSON.stringify(HttpResponse.failure("Failed to retrieve delivery details", 400)),
        { status: 400 }
      );
    }
  }

  async getOrderDeliveries(request: BunRequest): Promise<Response> {
    try {
      const { id: orderId } = request.params;
      const result = await this.deliveryService.getOrderDeliveries(orderId);
      return new Response(JSON.stringify(result), { status: result.statusCode });
    } catch (error) {
      return new Response(
        JSON.stringify(HttpResponse.failure("Failed to retrieve order deliveries", 400)),
        { status: 400 }
      );
    }
  }

  async updateTrackingInformation(request: BunRequest): Promise<Response> {
    try {
      const { id } = request.params;
      const trackingInfo = await request.json();
      const result = await this.deliveryService.updateTrackingInformation(id, trackingInfo);
      return new Response(JSON.stringify(result), { status: result.statusCode });
    } catch (error) {
      return new Response(
        JSON.stringify(HttpResponse.failure("Failed to update tracking information", 400)),
        { status: 400 }
      );
    }
  }
}
