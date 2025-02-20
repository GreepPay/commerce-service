import { Product, ProductType } from "../models/Product";
import HttpResponse, { type HttpResponseType } from "../common/HttpResponse";
import type { ICreateProduct } from "../forms/products";

export class ProductService {
  async createProduct(productData: ICreateProduct): Promise<HttpResponseType> {
    try {
      // Generate slug from name
      const slug = productData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      // Set default status if not provided
      const product = Product.create({
        ...productData,
        slug,
        status: productData.status || "active",
      });

      await product.save();
      return HttpResponse.success("Product created successfully", product, 201);
    } catch (error) {
      console.log({ error });
      return HttpResponse.failure("Failed to create product", 400);
    }
  }

  async getProductById(id: string): Promise<HttpResponseType> {
    try {
      const product = await Product.findOneBy({ id });
      if (!product) {
        return HttpResponse.notFound("Product not found");
      }
      return HttpResponse.success("Product retrieved successfully", product);
    } catch (error) {
      return HttpResponse.failure("Failed to retrieve product", 400);
    }
  }

  async getAllProducts(): Promise<HttpResponseType> {
    try {
      const products = await Product.find();
      return HttpResponse.success("Products retrieved successfully", products);
    } catch (error) {
      return HttpResponse.failure("Failed to retrieve products", 400);
    }
  }

  async updateProduct(
    id: string,
    productData: Partial<ICreateProduct>
  ): Promise<HttpResponseType> {
    try {
      const product = await Product.findOneBy({ id });
      if (!product) {
        return HttpResponse.notFound("Product not found");
      }
      Object.assign(product, productData);
      await product.save();
      return HttpResponse.success("Product updated successfully", product);
    } catch (error) {
      return HttpResponse.failure("Failed to update product", 400);
    }
  }

  async deleteProduct(id: string): Promise<HttpResponseType> {
    try {
      const result = await Product.delete(id);
      if (result.affected === 0) {
        return HttpResponse.notFound("Product not found");
      }
      return HttpResponse.success("Product deleted successfully");
    } catch (error) {
      return HttpResponse.failure("Failed to delete product", 400);
    }
  }

  async adjustInventory(
    productId: string,
    count: number
  ): Promise<HttpResponseType> {
    try {
      const product = await Product.findOneBy({ id: productId });
      if (!product) {
        return HttpResponse.notFound("Product not found");
      }

      product.inventoryCount = (product.inventoryCount || 0) + count;
      await product.save();

      return HttpResponse.success("Inventory adjusted successfully", product);
    } catch (error) {
      return HttpResponse.failure("Failed to adjust inventory", 400);
    }
  }

  async checkAvailability(productId: string): Promise<HttpResponseType> {
    try {
      const product = await Product.findOneBy({ id: productId });
      if (!product) {
        return HttpResponse.notFound("Product not found");
      }

      return HttpResponse.success("Product availability checked", {
        productId: product.id,
        available:
          product.inventoryCount !== undefined && product.inventoryCount > 0,
      });
    } catch (error) {
      return HttpResponse.failure("Failed to check availability", 400);
    }
  }

  async getProductTypes(): Promise<HttpResponseType> {
    try {
      const productTypes = Object.values(ProductType);
      return HttpResponse.success(
        "Product types retrieved successfully",
        productTypes
      );
    } catch (error) {
      return HttpResponse.failure("Failed to retrieve product types", 400);
    }
  }
}
