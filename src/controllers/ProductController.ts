import { ProductService } from "../services/ProductService";
import HttpResponse from "../common/HttpResponse";
import type { BunRequest } from "../routes/router";
import { Product } from "../models/Product";
import type { ICreateProduct } from "../forms/products";

export class ProductController {
  private productService: ProductService;

  constructor() {
    this.productService = new ProductService();
  }

  async getAllProducts(request: BunRequest) {
    const result = await this.productService.getAllProducts();
    return new Response(JSON.stringify(result.body), {
      headers: { "Content-Type": "application/json" },
      status: result.statusCode,
    });
  }

  async getProductById(request: BunRequest) {
    const id = request.params.id;
    const result = await this.productService.getProductById(id);
    return new Response(JSON.stringify(result.body), {
      headers: { "Content-Type": "application/json" },
      status: result.statusCode,
    });
  }

  async createProduct(request: BunRequest) {
    const productData = (await request.json()) as ICreateProduct;
    const result = await this.productService.createProduct(productData);
    return new Response(JSON.stringify(result.body), {
      headers: { "Content-Type": "application/json" },
      status: result.statusCode,
    });
  }

  async updateProduct(request: BunRequest) {
    const id = request.params.id;
    const productData = (await request.json()) as Partial<ICreateProduct>;
    const result = await this.productService.updateProduct(id, productData);
    return new Response(JSON.stringify(result.body), {
      headers: { "Content-Type": "application/json" },
      status: result.statusCode,
    });
  }

  async deleteProduct(request: BunRequest) {
    const id = request.params.id;
    const result = await this.productService.deleteProduct(id);
    return new Response(JSON.stringify(result.body), {
      headers: { "Content-Type": "application/json" },
      status: result.statusCode,
    });
  }

  async adjustInventory(request: BunRequest): Promise<Response> {
    try {
      const { id } = request.params;
      const { count } = (await request.json()) as { count: number };
      const result = await this.productService.adjustInventory(id, count);
      return new Response(JSON.stringify(result), {
        status: result.statusCode,
      });
    } catch (error) {
      return new Response(
        JSON.stringify(HttpResponse.failure("Failed to adjust inventory", 400)),
        { status: 400 }
      );
    }
  }

  async checkAvailability(request: BunRequest): Promise<Response> {
    try {
      const { id } = request.params;
      const result = await this.productService.checkAvailability(id);
      return new Response(JSON.stringify(result), {
        status: result.statusCode,
      });
    } catch (error) {
      return new Response(
        JSON.stringify(
          HttpResponse.failure("Failed to check availability", 400)
        ),
        { status: 400 }
      );
    }
  }

  async getProductTypes(request: BunRequest): Promise<Response> {
    try {
      const result = await this.productService.getProductTypes();
      return new Response(JSON.stringify(result), {
        status: result.statusCode,
      });
    } catch (error) {
      return new Response(
        JSON.stringify(
          HttpResponse.failure("Failed to retrieve product types", 400)
        ),
        { status: 400 }
      );
    }
  }
}
