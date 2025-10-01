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

    it("should generate slug from product name", async () => {
      const result = await productService.createProduct({
        name: "Test Product With Special Characters!@#",
        sku: "slug-test-001",
        description: "Test slug generation",
        type: ProductType.PHYSICAL,
        status: ProductStatus.ACTIVE,
        price: 1000,
        currency: "USD",
        businessId: 1,
        categoryIds: [],
        tags: [],
      });

      expect(result.slug).toBe("test-product-with-special-characters");
    });

    it("should handle slug generation with leading/trailing dashes", async () => {
      const result = await productService.createProduct({
        name: "!!!Product Name!!!",
        sku: "slug-test-002",
        description: "Test slug with leading/trailing special chars",
        type: ProductType.PHYSICAL,
        status: ProductStatus.ACTIVE,
        price: 1000,
        currency: "USD",
        businessId: 1,
        categoryIds: [],
        tags: [],
      });

      expect(result.slug).toBe("product-name");
    });

    it("should default status to 'active' when not provided", async () => {
      const productData: any = {
        name: "No Status Product",
        sku: "no-status-001",
        description: "Product without status",
        type: ProductType.PHYSICAL,
        price: 1000,
        currency: "USD",
        businessId: 1,
        categoryIds: [],
        tags: [],
      };
      // Explicitly remove status to test default behavior
      delete productData.status;

      const result = await productService.createProduct(productData);

      expect(result.status).toBe("active");
    });

    it("should preserve provided status", async () => {
      const result = await productService.createProduct({
        name: "Inactive Product",
        sku: "inactive-001",
        description: "Product with inactive status",
        type: ProductType.PHYSICAL,
        status: ProductStatus.ACTIVE,
        price: 1000,
        currency: "USD",
        businessId: 1,
        categoryIds: [],
        tags: [],
      });

      expect(result.status).toBe(ProductStatus.ACTIVE);
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
          sku: "test-sku-001",
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

    it("should update only provided fields using nullish coalescing", async () => {
      const originalName = testProduct.name;
      const originalDescription = testProduct.description;

      const updated = await productService.updateProduct(testProduct.id, {
        price: 999,
      });

      expect(updated.name).toBe(originalName); // Should remain unchanged
      expect(updated.description).toBe(originalDescription); // Should remain unchanged
      expect(updated.price).toBe(999); // Should be updated
    });

    it("should handle all field updates", async () => {
      const updateData = {
        name: "Completely Updated Product",
        description: "Updated description",
        type: ProductType.DIGITAL,
        price: 500,
        status: ProductStatus.INACTIVE,
        currency: "EUR",
      };

      const updated = await productService.updateProduct(
        testProduct.id,
        updateData
      );

      expect(updated.name).toBe(updateData.name);
      expect(updated.description).toBe(updateData.description);
      expect(updated.type).toBe(updateData.type);
      expect(updated.price).toBe(updateData.price);
      expect(updated.currency).toBe(updateData.currency);
    });

    it("should handle partial updates with some undefined values", async () => {
      const updateData: Partial<ICreateProduct> = {
        name: "Partially Updated",
        description: undefined, // This should keep original value
        price: 800,
      };

      const updated = await productService.updateProduct(
        testProduct.id,
        updateData
      );

      expect(updated.name).toBe("Partially Updated");
      expect(updated.description).toBe(testProduct.description); // Should remain original
      expect(updated.price).toBe(800);
    });

    it("throws 404 when updating non-existent product", async () => {
      await expect(
        productService.updateProduct(9999, { name: "Ghost" })
      ).rejects.toMatchObject({
        status: 404,
        message: "Product not found",
      });
    });
  });

  describe("adjustInventory", () => {
    it("should adjust inventory successfully (positive adjustment)", async () => {
      const originalCount = testProduct.inventoryCount || 0;
      const adjusted = await productService.adjustInventory(testProduct.id, 10);

      expect(adjusted).toBeInstanceOf(Product);
      expect(adjusted.inventoryCount).toBe(originalCount + 10);
    });

    it("should adjust inventory successfully (negative adjustment)", async () => {
      const adjusted = await productService.adjustInventory(testProduct.id, -5);
      expect(adjusted).toBeInstanceOf(Product);
      expect(adjusted.inventoryCount).toBeLessThanOrEqual(
        testProduct.inventoryCount
      );
    });

    it("should handle product with null/undefined inventoryCount", async () => {
      // Create a product without inventory count
      const productWithoutInventory = await productService.createProduct({
        name: "No Inventory Product",
        sku: "no-inv-001",
        description: "Product without initial inventory",
        type: ProductType.PHYSICAL,
        status: ProductStatus.ACTIVE,
        price: 100,
        currency: "USD",
        businessId: 1,
        categoryIds: [],
        tags: [],
        // inventoryCount not provided, should be null/undefined
      });

      // Set inventory to null to test the || 0 logic
      await dataSource
        .getRepository(Product)
        .update({ id: productWithoutInventory.id }, { inventoryCount: null });

      const adjusted = await productService.adjustInventory(
        productWithoutInventory.id,
        15
      );
      expect(adjusted.inventoryCount).toBe(15); // 0 + 15
    });

    it("should not allow negative inventory", async () => {
      await expect(
        productService.adjustInventory(testProduct.id, -9999)
      ).rejects.toThrow();
    });

    it("throws 400 when adjusting inventory to negative value", async () => {
      const product = await productService.createProduct({
        name: "Limited Stock",
        sku: "stock-000",
        description: "Low stock product",
        type: ProductType.PHYSICAL,
        status: ProductStatus.ACTIVE,
        price: 100,
        currency: "USD",
        businessId: 1,
        categoryIds: [],
        tags: [],
        inventoryCount: 2,
      });

      await expect(
        productService.adjustInventory(product.id, -5)
      ).rejects.toMatchObject({
        status: 400,
        message: "Insufficient inventory",
      });
    });

    it("should allow adjustment to exactly zero inventory", async () => {
      const product = await productService.createProduct({
        name: "Exact Zero Stock",
        sku: "zero-stock-001",
        description: "Product that will have zero stock",
        type: ProductType.PHYSICAL,
        status: ProductStatus.ACTIVE,
        price: 100,
        currency: "USD",
        businessId: 1,
        categoryIds: [],
        tags: [],
        inventoryCount: 5,
      });

      const adjusted = await productService.adjustInventory(product.id, -5);
      expect(adjusted.inventoryCount).toBe(0);
    });

    it("throws 404 when adjusting inventory for non-existent product", async () => {
      await expect(
        productService.adjustInventory(9999, 5)
      ).rejects.toMatchObject({
        status: 404,
        message: "Product not found",
      });
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

    it("should handle successful deletion with affected > 0", async () => {
      // Create a new product to delete
      const productToDelete = await productService.createProduct({
        name: "Delete Me",
        sku: "delete-001",
        description: "Product to be deleted",
        type: ProductType.PHYSICAL,
        status: ProductStatus.ACTIVE,
        price: 100,
        currency: "USD",
        businessId: 1,
        categoryIds: [],
        tags: [],
      });

      const result = await productService.deleteProduct(productToDelete.id);
      expect(result).toBe(true);
    });

    it("throws 404 when deleting non-existent product", async () => {
      await expect(productService.deleteProduct(9999)).rejects.toMatchObject({
        status: 404,
        message: "Product not found",
      });
    });

    it("throws 404 when delete result has no affected rows", async () => {
      // This tests the case where result.affected is 0 or undefined
      // We'll create a product, delete it, then try to delete it again
      const productToDelete = await productService.createProduct({
        name: "Double Delete Test",
        sku: "double-delete-001",
        description: "Product for double delete test",
        type: ProductType.PHYSICAL,
        status: ProductStatus.ACTIVE,
        price: 100,
        currency: "USD",
        businessId: 1,
        categoryIds: [],
        tags: [],
      });

      // First deletion should succeed
      await productService.deleteProduct(productToDelete.id);

      // Second deletion should throw 404
      await expect(
        productService.deleteProduct(productToDelete.id)
      ).rejects.toMatchObject({
        status: 404,
        message: "Product not found",
      });
    });
  });

  describe("Product entity model", () => {
    it("can instantiate Product and access properties", () => {
      const product = new Product();
      product.name = "Coverage Dummy";
      product.price = 99.99;
      product.type = "physical";
      product.status = "active";

      expect(product.name).toBe("Coverage Dummy");
    });
  });
});
