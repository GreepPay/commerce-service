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
      expect(adjusted.inventoryCount).toBeLessThanOrEqual(testProduct.inventoryCount);
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
