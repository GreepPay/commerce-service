import { Product, ProductType } from "../models/Product";
import HttpResponse, { type HttpResponseType } from "../common/HttpResponse";
import type { ICreateProduct } from "../forms/products";

export class ProductService {
  
  /**
   * Creates a new product with a slug generated from the product name.
   * If the status is not provided, defaults it to 'active'.
   * @param productData - Data used to create the product
   * @returns The created Product entity or an error response
   */
  async createProduct(
    productData: ICreateProduct
  ): Promise<Product> {
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

    return product;
  }

  /**
   * Updates an existing product with the given partial product data.
   * Returns a 404 response if the product is not found.
   * @param id - ID of the product to update
   * @param productData - Partial data to update the product
   * @returns The updated Product entity or an error response
   */
  async updateProduct(
    id: number,
    productData: Partial<ICreateProduct>
  ): Promise<Product> {
    const product = await Product.findOne({
      where: { id },
    });

    if (!product) {
      throw HttpResponse.notFound("Product not found");
    }

    product.name = productData.name ?? product.name;
    product.description = productData.description ?? product.description;
    product.type = productData.type ?? product.type;
    product.price = productData.price ?? product.price;
    product.status = productData.status ?? product.status;
    product.currency = productData.currency ?? product.currency;

    await product.save();

    return product;
  }

  /**
   * Deletes a product by its ID.
   * Returns true if deletion was successful or a 404 response if not found.
   * @param id - ID of the product to delete
   * @returns Boolean indicating success or an error response
   */
  async deleteProduct(id: number): Promise<boolean | HttpResponseType> {
    const result = await Product.delete(id);

    return result.affected! > 0
      ? true
      : HttpResponse.notFound("Product not found");
  }

  /**
   * Adjusts the inventory count of a product.
   * Adds the given count to the existing inventory count.
   * Returns a 404 response if the product is not found.
   * @param productId - ID of the product to adjust inventory for
   * @param count - Number to add (or subtract if negative) from inventory
   * @returns The updated Product entity or an error response
   */
  async adjustInventory(
    productId: number,
    count: number
  ): Promise<Product | HttpResponseType> {
      const product = await Product.findOne({ where: { id: productId } });
      if (!product) {
        return HttpResponse.notFound("Product not found");
      }

      product.inventoryCount = (product.inventoryCount || 0) + count;
      await product.save();

      return product;
    }
}
