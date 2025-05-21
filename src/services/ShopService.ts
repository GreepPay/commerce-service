import { Shop } from "../models/Shop";
import HttpResponse, { type HttpResponseType } from "../common/HttpResponse";
import type { ICreateShop, IUpdateShop } from "../forms/shop";

export class ShopService {
  async createShop(shopData: ICreateShop): Promise<HttpResponseType> {
    try {
      const shop = Shop.create({
        ...shopData,
        status: "active"
      });

      await shop.save();
      return HttpResponse.success("Shop created successfully", shop, 201);
    } catch (error) {
      console.error("Create Shop Error:", error);
      return HttpResponse.failure("Failed to create shop", 400);
    }
  }

  async updateShop(id: string, shopData: IUpdateShop): Promise<HttpResponseType> {
    try {
      const shop = await Shop.findOneBy({ id });
      if (!shop) {
        return HttpResponse.notFound("Shop not found");
      }

      Object.assign(shop, shopData);
      await shop.save();
      
      return HttpResponse.success("Shop updated successfully", shop);
    } catch (error) {
      return HttpResponse.failure("Failed to update shop", 400);
    }
  }

  async deleteShop(id: string): Promise<HttpResponseType> {
    try {
      const result = await Shop.delete(id);
      if (result.affected === 0) {
        return HttpResponse.notFound("Shop not found");
      }
      return HttpResponse.success("Shop deleted successfully");
    } catch (error) {
      return HttpResponse.failure("Failed to delete shop", 400);
    }
  }
}