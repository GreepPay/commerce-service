import { ProductService } from "../services/ProductService";
import HttpResponse from "../common/HttpResponse";
import type { BunRequest, Validation } from "../routes/router";
import {
  BillingInterval,
  LicenseType,
  ProductType,
  ShippingClass,
  type ICreateProduct,
} from "../forms/products";
import { EventType, ProductStatus } from "../models/Product";
import {
  baseProductFields,
  optionalTypeFields,
} from "../helper/validation/productValidation";

export class ProductController {
  private productService: ProductService;

  constructor() {
    this.productService = new ProductService();
  }

  /**
   * Handles creation of a new product.
   * Validates incoming request body and delegates to the product service.
   * @param request - Incoming HTTP request
   * @returns HTTP response with created product or error
   */

  async createProduct(request: BunRequest) {
    try {
      const allFields = [...baseProductFields, ...optionalTypeFields];
      const productData = await request.validate(allFields);

      const result = await this.productService.createProduct(productData);
      return HttpResponse.success("Product created successfully", result, 201);
    } catch (error: any) {
      return HttpResponse.failure(
        error.message || "Internal server error",
        error.status || 500
      );
    }
  }

  /**
   * Handles updating an existing product.
   * Validates request and passes partial updates to the product service.
   * @param request - Incoming HTTP request with updated fields and product ID
   * @returns HTTP response with updated product or error
   */
  async updateProduct(request: BunRequest) {
    try {
      const validations: Validation[] = [
        { field: "id", type: "sring", required: true },
        { field: "name", type: "string", required: false },
        { field: "description", type: "string", required: false },
        { field: "type", type: "string", required: false },
        { field: "price", type: "number", required: false },
        { field: "status", type: "string", required: false },
        { field: "currency", type: "string", required: false },
        { field: "categoryIds", type: "array", required: false },
        { field: "tags", type: "array", required: false },
      ];
      const id = request.params.id;

      let productData: ICreateProduct = (await request.validate(
        validations
      )) as ICreateProduct;

      const result = await this.productService.updateProduct(
        parseInt(id),
        productData
      );

      return HttpResponse.success("Product updated successfully", result);
    } catch (error: any) {
      return HttpResponse.failure(
        error.message || "Internal server error",
        error.status || 500
      );
    }
  }

  /**
   * Handles deletion of a product by ID.
   * Validates request and calls the service to delete the product.
   * @param request - Incoming HTTP request with product ID
   * @returns HTTP response indicating success or failure
   */
  async deleteProduct(request: BunRequest) {
    try {
      const validations: Validation[] = [
        { field: "id", type: "string", required: true },
      ];

      const { id } = (await request.validate(validations)) as { id: string };

      const result = await this.productService.deleteProduct(parseInt(id));

      if (result === true) {
        return HttpResponse.success("Product deleted successfully", null, 204);
      }

      return result;
    } catch (error: any) {
      return HttpResponse.failure(
        error.message || "Internal server error",
        error.status || 500
      );
    }
  }

  /**
   * Adjusts the inventory count of a product.
   * Validates request and calls the service to update the inventory.
   * @param request - Incoming HTTP request with product ID and inventory count
   * @returns HTTP response indicating adjustment success or failure
   */
  async adjustInventory(request: BunRequest) {
    try {
      const validations: Validation[] = [
        { field: "id", type: "string", required: true },
        { field: "count", type: "number", required: true },
      ];

      const { id, count } = (await request.validate(validations)) as {
        id: string;
        count: number;
      };

      await this.productService.adjustInventory(parseInt(id), count);
      return HttpResponse.success("Inventory adjusted successfully", null, 204);
    } catch (error: any) {
      return HttpResponse.failure(
        error.message || "Internal server error",
        error.status || 500
      );
    }
  }
}
