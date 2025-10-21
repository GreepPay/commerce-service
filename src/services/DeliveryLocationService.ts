import { AppDataSource } from "../data-source";
import { DeliveryLocation } from "../models/DeliveryLocation";
import { DeliveryPricing } from "../models/DeliveryPricing";

export class DeliveryLocationService {
  private locationRepo = AppDataSource.getRepository(DeliveryLocation);
  private pricingRepo = AppDataSource.getRepository(DeliveryPricing);

  // DeliveryLocation CRUD
  async createLocation(data: {
    country: string;
    area: string;
    status?: string;
  }): Promise<DeliveryLocation> {
    const location = this.locationRepo.create({
      country: data.country,
      area: data.area,
      status: data.status || "active",
    });
    return this.locationRepo.save(location);
  }

  async updateLocation(
    id: number,
    data: Partial<{ country: string; area: string; status: string }>
  ): Promise<DeliveryLocation | null> {
    const location = await this.locationRepo.findOne({ where: { id } });
    if (!location) return null;
    Object.assign(location, data);
    return this.locationRepo.save(location);
  }

  async deleteLocation(id: number): Promise<boolean> {
    const result = await this.locationRepo.delete(id);
    return !!result.affected && result.affected > 0;
  }

}
