import { DeliveryLocationService } from "../services/DeliveryLocationService";
import HttpResponse from "../common/HttpResponse";
import type { BunRequest } from "../routes/router";

export class DeliveryLocationController {
  private service: DeliveryLocationService;

  constructor() {
    this.service = new DeliveryLocationService();
  }

  async create(request: BunRequest) {
    try {
      const { country, area, status } = (await request.json()) as {
        country: string;
        area: string;
        status?: string;
      };
      const location = await this.service.createLocation({
        country,
        area,
        status,
      });
      return HttpResponse.success("Created delivery location", location, 201);
    } catch (error: any) {
      return HttpResponse.failure(
        error.message || "Failed to create location",
        error.status || 500
      );
    }
  }

  async update(request: BunRequest) {
    try {
      const { id } = request.params;
      const data = (await request.json()) as Partial<{
        country: string;
        area: string;
        status: string;
      }>;
      const location = await this.service.updateLocation(Number(id), data);
      if (!location) return HttpResponse.failure("Location not found", 404);
      return HttpResponse.success("Updated delivery location", location);
    } catch (error: any) {
      return HttpResponse.failure(
        error.message || "Failed to update location",
        error.status || 500
      );
    }
  }

  async delete(request: BunRequest) {
    try {
      const { id } = request.params;
      const deleted = await this.service.deleteLocation(Number(id));
      if (!deleted) return HttpResponse.failure("Location not found", 404);
      return HttpResponse.success("Deleted delivery location", null, 204);
    } catch (error: any) {
      return HttpResponse.failure(
        error.message || "Failed to delete location",
        error.status || 500
      );
    }
  }

