import { AppDataSource } from "../data-source";
import { DeliveryPricing } from "../models/DeliveryPricing";
import { DeliveryLocation } from "../models/DeliveryLocation";

export class DeliveryPricingService {
  private pricingRepo = AppDataSource.getRepository(DeliveryPricing);

  async createPricing(data: {
    originLocationId: number;
    destinationLocationId: number;
    price: number;
    status?: string;
  }): Promise<DeliveryPricing> {
    const pricing = this.pricingRepo.create({
      originLocation: { id: data.originLocationId },
      destinationLocation: { id: data.destinationLocationId },
      price: data.price,
      status: data.status || "active",
    });
    return this.pricingRepo.save(pricing);
  }

  async updatePricing(
    id: number,
    data: Partial<{
      originLocationId: number;
      destinationLocationId: number;
      price: number;
      status: string;
    }>
  ): Promise<DeliveryPricing | null> {
    const pricing = await this.pricingRepo.findOne({
      where: { id },
      relations: ["originLocation", "destinationLocation"],
    });
    if (!pricing) return null;
    if (data.originLocationId)
      pricing.originLocation = {
        id: data.originLocationId,
      } as DeliveryLocation;
    if (data.destinationLocationId)
      pricing.destinationLocation = {
        id: data.destinationLocationId,
      } as DeliveryLocation;
    if (data.price !== undefined) pricing.price = data.price;
    if (data.status) pricing.status = data.status;
    return this.pricingRepo.save(pricing);
  }

  async deletePricing(id: number): Promise<boolean> {
    const result = await this.pricingRepo.delete(id);
    return !!result.affected && result.affected > 0;
  }
}
