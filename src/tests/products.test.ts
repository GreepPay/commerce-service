import {
  describe,
  it,
  expect,
  beforeAll,
  afterAll,
  beforeEach,
} from "bun:test";
import { DataSource } from "typeorm";
import { ProductService } from "../services/ProductService";
import { Product } from "../models/Product";
import { Category } from "../models/Category";
import {
  ProductStatus,
  ProductType,
  type BaseProduct,
  type ICreateProduct,
} from "../forms/products";

describe("ProductService Tests", () => {
  let dataSource: DataSource;
  let productService: ProductService;
  let testProduct: Product;

  beforeAll(async () => {
    dataSource = new DataSource({
      type: "sqlite",
      database: ":memory:",
      entities: [Product, Category],
      synchronize: true,
      logging: false,
    });

    await dataSource.initialize();
    productService = new ProductService();
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  beforeEach(async () => {
    await dataSource.getRepository(Product).clear();
    await dataSource.getRepository(Category).clear();

    const categoryRepository = dataSource.getRepository(Category);
    const electronics = categoryRepository.create({
      name: "electronics",
      slug: "electronics",
    });
    await categoryRepository.save(electronics);

    // ✅ Create test product for reuse
    testProduct = await productService.createProduct({
      name: "Reusable Product",
      sku: "test-sku-001",
      description: "Reusable product for all tests",
      type: ProductType.PHYSICAL,
      status: ProductStatus.ACTIVE,
      price: 1000,
      currency: "USD",
      businessId: 1,
      categoryIds: [],
      tags: [],
      inventoryCount: 30,
    });
  });

  describe("createProduct", () => {
    it("should create new product successfully", async () => {
      const result = await productService.createProduct({
        name: "Another Product",
        sku: "new-sku-001",
        description: "Test product creation",
        type: ProductType.PHYSICAL,
        status: ProductStatus.ACTIVE,
        price: 2000,
        currency: "USD",
        businessId: 1,
        categoryIds: [],
        tags: [],
      });

      expect(result).toBeInstanceOf(Product);
      expect(result.name).toBe("Another Product");
    });

    describe("Product Type Variants", () => {
      it("should create a physical product", async () => {
        const product = await productService.createProduct({
          name: "Physical Product",
          sku: "sku-phys-001",
          description: "Has weight and dimensions",
          type: ProductType.PHYSICAL,
          status: ProductStatus.ACTIVE,
          price: 100,
          currency: "USD",
          businessId: 1,
          categoryIds: [],
          tags: [],
          weight: 1.5,
          dimensions: JSON.stringify({ length: 10, width: 5, height: 2 }),
          inventoryCount: 20,
        });

        expect(product).toBeInstanceOf(Product);
        expect(product.type).toBe(ProductType.PHYSICAL);
        expect(product.weight).toBe(1.5);
      });

      it("should create a digital product", async () => {
        const product = await productService.createProduct({
          name: "Ebook",
          sku: "sku-dig-001",
          description: "Downloadable file",
          type: ProductType.DIGITAL,
          status: ProductStatus.ACTIVE,
          price: 20,
          currency: "USD",
          businessId: 1,
          categoryIds: [],
          tags: [],
          downloadUrl: "https://files.example.com/ebook.pdf",
        });

        expect(product.type).toBe(ProductType.DIGITAL);
        expect(product.downloadUrl).toContain("https");
      });

      it("should create a subscription product", async () => {
        const product = await productService.createProduct({
          name: "Pro Plan",
          sku: "sku-sub-001",
          description: "Recurring subscription",
          type: ProductType.SUBSCRIPTION,
          status: ProductStatus.ACTIVE,
          price: 15,
          currency: "USD",
          businessId: 1,
          categoryIds: [],
          tags: [],
          billingInterval: "monthly",
          trialPeriodDays: 14,
        });

        expect(product.type).toBe(ProductType.SUBSCRIPTION);
        expect(product.billingInterval).toBe("monthly");
        expect(product.trialPeriodDays).toBe(14);
      });

      it("should create an event product", async () => {
        const product = await productService.createProduct({
          name: "Tech Conference",
          sku: "sku-event-001",
          description: "Live tech event",
          type: ProductType.EVENT,
          status: ProductStatus.ACTIVE,
          price: 200,
          currency: "USD",
          businessId: 1,
          categoryIds: [],
          tags: [],
          eventType: "offline",
          eventStartDate: new Date("2025-07-01"),
          eventEndDate: new Date("2025-07-02"),
          venueName: "Expo Center",
          eventCapacity: 300,
          eventWaitlistEnabled: true,
        });

        expect(product.type).toBe(ProductType.EVENT);
        expect(product.eventType).toBe("offline");
        expect(product.eventCapacity).toBe(300);
      });
    });

    describe("Product Type Variants", () => {
      it("should create a physical product", async () => {
        const product = await productService.createProduct({
          name: "Physical Product",
          sku: "sku-phys-001",
          description: "Has weight and dimensions",
          type: ProductType.PHYSICAL,
          status: ProductStatus.ACTIVE,
          price: 100,
          currency: "USD",
          businessId: 1,
          categoryIds: [],
          tags: [],
          weight: 1.5,
          dimensions: JSON.stringify({ length: 10, width: 5, height: 2 }),
          inventoryCount: 20,
        });

        expect(product).toBeInstanceOf(Product);
        expect(product.type).toBe(ProductType.PHYSICAL);
        expect(product.weight).toBe(1.5);
      });

      it("should create a digital product", async () => {
        const product = await productService.createProduct({
          name: "Ebook",
          sku: "sku-dig-001",
          description: "Downloadable file",
          type: ProductType.DIGITAL,
          status: ProductStatus.ACTIVE,
          price: 20,
          currency: "USD",
          businessId: 1,
          categoryIds: [],
          tags: [],
          downloadUrl: "https://files.example.com/ebook.pdf",
        });

        expect(product.type).toBe(ProductType.DIGITAL);
        expect(product.downloadUrl).toContain("https");
      });

      it("should create a subscription product", async () => {
        const product = await productService.createProduct({
          name: "Pro Plan",
          sku: "sku-sub-001",
          description: "Recurring subscription",
          type: ProductType.SUBSCRIPTION,
          status: ProductStatus.ACTIVE,
          price: 15,
          currency: "USD",
          businessId: 1,
          categoryIds: [],
          tags: [],
          billingInterval: "monthly",
          trialPeriodDays: 14,
        });

        expect(product.type).toBe(ProductType.SUBSCRIPTION);
        expect(product.billingInterval).toBe("monthly");
        expect(product.trialPeriodDays).toBe(14);
      });

      it("should create an event product", async () => {
        const product = await productService.createProduct({
          name: "Tech Conference",
          sku: "sku-event-001",
          description: "Live tech event",
          type: ProductType.EVENT,
          status: ProductStatus.ACTIVE,
          price: 200,
          currency: "USD",
          businessId: 1,
          categoryIds: [],
          tags: [],
          eventType: "offline",
          eventStartDate: new Date("2025-07-01"),
          eventEndDate: new Date("2025-07-02"),
          venueName: "Expo Center",
          eventCapacity: 300,
          eventWaitlistEnabled: true,
        });

        expect(product.type).toBe(ProductType.EVENT);
        expect(product.eventType).toBe("offline");
        expect(product.eventCapacity).toBe(300);
      });

      it("should throw an error for missing required fields", async () => {
        await expect(
          productService.createProduct({
            name: "",
            sku: "",
            description: "",
            type: "" as ProductType,
            status: ProductStatus.ACTIVE,
            price: NaN,
            currency: "",
            businessId: null as unknown as number,
            categoryIds: [],
            tags: [],
          })
        ).rejects.toThrow();
      });

      it("should throw an error for duplicate SKU", async () => {
        await expect(
          productService.createProduct({
            name: "Duplicate SKU",
            sku: "test-sku-001", // same as testProduct
            description: "Attempt to reuse SKU",
            type: ProductType.PHYSICAL,
            status: ProductStatus.ACTIVE,
            price: 500,
            currency: "USD",
            businessId: 1,
            categoryIds: [],
            tags: [],
          })
        ).rejects.toThrow(/UNIQUE constraint failed|duplicate/i);
      });
    });
  });

  describe("updateProduct", () => {
    it("should update product successfully", async () => {
      const updated = await productService.updateProduct(testProduct.id, {
        name: "Updated Product",
        price: 75,
      });

      expect(updated).toBeInstanceOf(Product);
      expect(updated.name).toBe("Updated Product");
      expect(updated.price).toBe(75);
    });
  });

  describe("adjustInventory", () => {
    it("should adjust inventory successfully", async () => {
      const adjusted = await productService.adjustInventory(testProduct.id, -5);
      expect(adjusted).toBeInstanceOf(Product);
      expect(adjusted.inventoryCount).toBeLessThanOrEqual(
        testProduct.inventoryCount
      );
    });

    it("should not allow negative inventory", async () => {
      await expect(
        productService.adjustInventory(testProduct.id, -9999)
      ).rejects.toThrow();
    });
  });

  describe("deleteProduct", () => {
    it("should delete product successfully", async () => {
      const result = await productService.deleteProduct(testProduct.id);
      expect(result).toBe(true);

      const found = await dataSource.getRepository(Product).findOne({
        where: { id: testProduct.id },
      });
      expect(found).toBeNull();
    });
  });
});
