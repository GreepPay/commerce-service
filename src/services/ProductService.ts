import { Product } from "../models/Product";
import type { ICreateProduct } from "../forms/products";
import { Category } from "../models/Category";

export class ProductService {
  /**
   * Creates a new product with a slug generated from the product name.
   * If the status is not provided, defaults it to 'active'.
   * @param productData - Data used to create the product
   * @returns The created Product entity or an error response
   */
  async createProduct(productData: ICreateProduct): Promise<Product> {
    // Generate slug from name
    const slug =
      productData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "") + Math.random().toString(36).substring(2, 9);

    // Set default status if not provided
    const product = Product.create();

    product.slug = slug;
    product.status = productData.status || "active";
    product.businessId = productData.businessId;
    product.sku =
      productData.sku || `SKU-${Math.random().toString(36).substring(2, 9)}`;
    product.name = productData.name || "";
    product.description = productData.description || "";
    product.price = productData.price || 0;
    product.currency = productData.currency || "USD";
    product.type = productData.type || "physical";
    product.variants = productData.variants?.length ? productData.variants : [];
    product.inventoryCount = productData.inventoryCount || 0;
    product.stockThreshold = productData.stockThreshold || 0;
    product.isBackorderAllowed = productData.isBackorderAllowed || false;
    product.images = productData.images || [];

    // Digital products
    if (productData.digitalDetails) {
      product.downloadUrl = productData.digitalDetails.download.url;
      product.downloadLimit = productData.digitalDetails.download.downloadLimit;
    }

    // Physical products
    if (productData.physicalDetails) {
      product.weight = productData.physicalDetails.weight;
      product.dimensions = productData.physicalDetails.dimensions;
    }

    // Subscription products
    if (productData.subscriptionDetails) {
      product.billingInterval =
        (productData.subscriptionDetails.billing.interval as
          | "monthly"
          | "yearly") || "monthly";
      product.trialPeriodDays =
        productData.subscriptionDetails.billing.trialDays || 0;
    }

    // Event products
    if (productData.eventDetails) {
      product.eventType = productData.eventDetails.eventType;
      product.eventStartDate = productData.eventDetails.eventDetails.startDate;
      product.eventEndDate = productData.eventDetails.eventDetails.endDate;
      product.venueName = productData.eventDetails.eventDetails.venueName || "";
      product.eventOnlineUrl =
        productData.eventDetails.eventDetails.onlineUrl || "";
      product.eventLocation = productData.eventDetails.eventDetails.location;
      product.eventCapacity =
        productData.eventDetails.eventDetails.capacity || 0;
      product.eventRegisteredCount =
        productData.eventDetails.eventDetails.registeredCount || 0;
      product.eventWaitlistEnabled =
        productData.eventDetails.eventDetails.waitlistEnabled || false;
    }

    if (productData.categoryIds && productData.categoryIds.length > 0) {
      const name = productData.categoryIds[0].trim();

      let category = await Category.findOne({ where: { name } });

      if (!category) {
        category = Category.create();
        category.name = name;
        category.slug =
          name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "") +
          "-" +
          Math.random().toString(36).substring(2, 9);
        await category.save();
      }

      // assign the found/created category id to the product
      product.categoryId = category.id;
    }

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

    console.log("Updating product:", productData);

    if (!product) {
      throw {
        status: 404,
        message: "Product not found",
      };
    }

    product.businessId = productData.businessId
      ? productData.businessId
      : product.businessId;
    product.sku = productData.sku ? productData.sku : product.sku;
    product.status = productData.status ? productData.status : product.status;
    product.type = productData.type ? productData.type : product.type;
    product.name = productData.name ? productData.name : product.name;
    product.description = productData.description
      ? productData.description
      : product.description;
    product.price = productData.price ? productData.price : product.price;
    product.currency = productData.currency
      ? productData.currency
      : product.currency;
    product.type = productData.type ? productData.type : product.type;
    product.variants = productData.variants?.length
      ? productData.variants
      : product.variants;
    product.inventoryCount = productData.inventoryCount
      ? productData.inventoryCount
      : product.inventoryCount;
    product.stockThreshold = productData.stockThreshold
      ? productData.stockThreshold
      : product.stockThreshold;
    product.isBackorderAllowed = productData.isBackorderAllowed
      ? productData.isBackorderAllowed
      : product.isBackorderAllowed;
    product.images = productData.images?.length
      ? productData.images
      : product.images;

    if (productData.digitalDetails) {
      product.downloadUrl = productData.digitalDetails.download?.url
        ? productData.digitalDetails.download?.url
        : product.downloadUrl;
      product.downloadLimit = productData.digitalDetails.download?.downloadLimit
        ? productData.digitalDetails.download?.downloadLimit
        : product.downloadLimit;
    }

    if (productData.physicalDetails) {
      product.weight = productData.physicalDetails.weight
        ? productData.physicalDetails.weight
        : product.weight;
      product.dimensions = productData.physicalDetails.dimensions
        ? productData.physicalDetails.dimensions
        : product.dimensions;
    }

    if (productData.subscriptionDetails) {
      product.billingInterval =
        (productData.subscriptionDetails.billing?.interval as
          | "monthly"
          | "yearly") ??
        (product.billingInterval || "monthly");
      product.trialPeriodDays = productData.subscriptionDetails.billing
        ?.trialDays
        ? productData.subscriptionDetails.billing?.trialDays
        : product.trialPeriodDays;
    }

    if (productData.eventDetails) {
      product.eventType = productData.eventDetails.eventType
        ? productData.eventDetails.eventType
        : product.eventType;
      product.eventStartDate = productData.eventDetails.eventDetails?.startDate
        ? productData.eventDetails.eventDetails?.startDate
        : product.eventStartDate;
      product.eventEndDate = productData.eventDetails.eventDetails?.endDate
        ? productData.eventDetails.eventDetails?.endDate
        : product.eventEndDate;
      product.venueName = productData.eventDetails.eventDetails?.venueName
        ? productData.eventDetails.eventDetails?.venueName
        : product.venueName;
      product.eventOnlineUrl = productData.eventDetails.eventDetails?.onlineUrl
        ? productData.eventDetails.eventDetails?.onlineUrl
        : product.eventOnlineUrl;
      product.eventLocation = productData.eventDetails.eventDetails?.location
        ? productData.eventDetails.eventDetails?.location
        : product.eventLocation;
      product.eventCapacity = productData.eventDetails.eventDetails?.capacity
        ? productData.eventDetails.eventDetails?.capacity
        : product.eventCapacity;
      product.eventCapacity;
      product.eventRegisteredCount = productData.eventDetails.eventDetails
        ?.registeredCount
        ? productData.eventDetails.eventDetails?.registeredCount
        : product.eventRegisteredCount;
      product.eventWaitlistEnabled = productData.eventDetails.eventDetails
        ?.waitlistEnabled
        ? productData.eventDetails.eventDetails?.waitlistEnabled
        : product.eventWaitlistEnabled;
    }

    if (productData.categoryIds && productData.categoryIds.length > 0) {
      const name = productData.categoryIds[0].trim();

      let category = await Category.findOne({ where: { name } });

      if (!category) {
        category = Category.create();
        category.name = name;
        category.slug =
          name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "") +
          "-" +
          Math.random().toString(36).substring(2, 9);
        await category.save();
      }

      // assign the found/created category id to the product
      product.categoryId = category.id;
    }

    await product.save();

    return product;
  }

  /**
   * Deletes a product by its ID.
   * Returns true if deletion was successful or throws a 404 error if not found.
   * @param id - ID of the product to delete
   * @returns Boolean indicating success
   */
  async deleteProduct(id: number): Promise<boolean> {
    const result = await Product.delete(id);

    if (result.affected && result.affected > 0) {
      return true;
    }

    throw {
      status: 404,
      message: "Product not found",
    };
  }

  /**
   * Adjusts the inventory count of a product.
   * Adds the given count to the existing inventory count.
   * Returns a 404 response if the product is not found.
   * @param productId - ID of the product to adjust inventory for
   * @param count - Number to add (or subtract if negative) from inventory
   * @returns The updated Product entity or an error response
   */
  async adjustInventory(productId: number, count: number): Promise<Product> {
    const product = await Product.findOne({ where: { id: productId } });
    if (!product) {
      throw {
        status: 404,
        message: "Product not found",
      };
    }

    const newCount = (product.inventoryCount || 0) + count;
    if (newCount < 0) {
      throw {
        status: 400,
        message: "Insufficient inventory",
      };
    }

    product.inventoryCount = newCount;
    await product.save();

    return product;
  }
}
