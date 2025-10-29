import { DeliveryLocationService } from "../services/DeliveryLocationService";
import HttpResponse from "../common/HttpResponse";
import type { BunRequest } from "../routes/router";

export class DeliveryPricingController {
  private service: DeliveryLocationService;

  constructor() {
    this.service = new DeliveryLocationService();
  }

  async create(request: BunRequest) {
    try {
      const { originLocationId, destinationLocationId, price, status } =
        (await request.json()) as {
          originLocationId: number;
          destinationLocationId: number;
          price: number;
          status?: string;
        };
      const pricing = await this.service.createPricing({
        originLocationId,
        destinationLocationId,
        price,
        status,
      });
      return HttpResponse.success("Created delivery pricing", pricing, 201);
    } catch (error: any) {
      return HttpResponse.failure(
        error.message || "Failed to create pricing",
        error.status || 500
      );
    }
  }

  async update(request: BunRequest) {
    try {
      const { id } = request.params;
      const data = (await request.json()) as Partial<{
        originLocationId: number;
        destinationLocationId: number;
        price: number;
        status: string;
      }>;
      const pricing = await this.service.updatePricing(Number(id), data);
      if (!pricing) return HttpResponse.failure("Pricing not found", 404);
      return HttpResponse.success("Updated delivery pricing", pricing);
    } catch (error: any) {
      return HttpResponse.failure(
        error.message || "Failed to update pricing",
        error.status || 500
      );
    }
  }

  async delete(request: BunRequest) {
    try {
      const { id } = request.params;
      const deleted = await this.service.deletePricing(Number(id));
      if (!deleted) return HttpResponse.failure("Pricing not found", 404);
      return HttpResponse.success("Deleted delivery pricing", null, 204);
    } catch (error: any) {
      return HttpResponse.failure(
        error.message || "Failed to delete pricing",
        error.status || 500
      );
    }
  }
}
