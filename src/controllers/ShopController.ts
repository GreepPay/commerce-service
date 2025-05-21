import { ShopService } from "../services/ShopService";
import HttpResponse from "../common/HttpResponse";
import type { BunRequest } from "../routes/router";
import type { ICreateShop, IUpdateShop } from "../forms/shop";

export class ShopController {
  private shopService: ShopService;

  constructor() {
    this.shopService = new ShopService();
  }

  async createShop(request: BunRequest) {
    try {
      const shopData = (await request.json()) as ICreateShop;
      const result = await this.shopService.createShop(shopData);
      return new Response(JSON.stringify(result.body), {
        headers: { "Content-Type": "application/json" },
        status: result.statusCode,
      });
    } catch (error) {
      return new Response(
        JSON.stringify(HttpResponse.failure("Failed to create shop", 400)),
        { status: 400 }
      );
    }
  }




  async updateShop(request: BunRequest) {
    try {
      const { id } = request.params;
      const shopData = (await request.json()) as IUpdateShop;
      const result = await this.shopService.updateShop(id, shopData);
      return new Response(JSON.stringify(result.body), {
        headers: { "Content-Type": "application/json" },
        status: result.statusCode,
      });
    } catch (error) {
      return new Response(
        JSON.stringify(HttpResponse.failure("Failed to update shop", 400)),
        { status: 400 }
      );
    }
  }

  async deleteShop(request: BunRequest) {
    try {
      const { id } = request.params;
      const result = await this.shopService.deleteShop(id);
      return new Response(JSON.stringify(result.body), {
        headers: { "Content-Type": "application/json" },
        status: result.statusCode,
      });
    } catch (error) {
      return new Response(
        JSON.stringify(HttpResponse.failure("Failed to delete shop", 400)),
        { status: 400 }
      );
    }
  }
}