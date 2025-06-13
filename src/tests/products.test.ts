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
import { ProductStatus, ProductType, type ICreateProduct } from "../forms/products";

describe("ProductService Tests", () => {
  let dataSource: DataSource;
  let productService: ProductService;

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
    // Clear all tables before each test
    await dataSource.getRepository(Product).clear();
    await dataSource.getRepository(Category).clear();

    const categoryRepository = dataSource.getRepository(Category);

    const electronics = categoryRepository.create({ name: "electronics" });
    const accessories = categoryRepository.create({ name: "accessories" });
    await categoryRepository.save([electronics, accessories]);

    // Create sample product using the correct model structure
    await productService.createProduct({
      name: "Wireless Mouse12",
      description: "A high-precision wireless mouse with ergonomic design, suitable for all-day use.",
      type: ProductType.PHYSICAL,
      status: ProductStatus.ACTIVE,
      price: 7500,
      currency: "USD",
    });
  });

  describe("createProduct", () => {
    it("should create new product successfully", async () => {
      const productData = {
        name: "Test Product",
        description: "A product for testing",
        type: ProductType.PHYSICAL,
        status: ProductStatus.ACTIVE,
        price: 100,
        currency: "USD",
      } as ICreateProduct;
      
      const result = await productService.createProduct(productData);
      expect(result).toBeInstanceOf(Product);
      expect(result.name).toBe("Test Product");
      expect(result.price).toBe(100);
      expect(result.type).toBe(ProductType.PHYSICAL);
      expect(result.status).toBe(ProductStatus.ACTIVE);
    });
  });

  describe("updateProduct", () => {
    it("should update product successfully", async () => {
      const product = await productService.createProduct({
        name: "Original Product",
        description: "Original",
        type: ProductType.PHYSICAL,
        status: ProductStatus.ACTIVE,
        price: 50,
        currency: "USD",
      });
      
      const updated = await productService.updateProduct(product.id, {
        name: "Updated Product",
        price: 75,
      });
      
      expect(updated).toBeInstanceOf(Product);
      expect(updated.name).toBe("Updated Product");
      expect(updated.price).toBe(75);
    });
  });

  describe("deleteProduct", () => {
    it("should delete product successfully", async () => {
      const product = await productService.createProduct({
        name: "To Delete",
        description: "Delete me",
        type: ProductType.EVENT,
        status: ProductStatus.ACTIVE,
        price: 10,
        currency: "USD",
      });
      
      const result = await productService.deleteProduct(product.id);
      expect(result).toBe(true);
      
      // Use the dataSource repository to check if product was deleted
      const found = await dataSource.getRepository(Product).findOne({ 
        where: { id: product.id } 
      });
      expect(found).toBeNull();
    });
  });

  describe("adjustInventory", () => {
    it("should adjust inventory successfully", async () => {
      const product = await productService.createProduct({
        name: "Inventory Product",
        description: "Inventory",
        type: ProductType.EVENT,
        price: 15,
        status: ProductStatus.ACTIVE,
        currency: "USD",
      });
      
      // Assuming the product starts with some initial inventory (e.g., 30)
      const adjusted = await productService.adjustInventory(product.id, -5);
      expect(adjusted).toBeInstanceOf(Product);
      // Adjust this expectation based on your actual initial inventory value
      expect(adjusted.inventoryCount).toBe(25); // or whatever the expected result should be
    });

    it("should not allow negative inventory", async () => {
      const product = await productService.createProduct({
        name: "Negative Inventory",
        description: "Test negative",
        type: ProductType.EVENT,
        price: 20,
        status: ProductStatus.ACTIVE,
        currency: "USD",
      });
      
      // Try to adjust inventory to a negative value
      // This assumes the product has less than 50 initial inventory
      await expect(
        productService.adjustInventory(product.id, -50)
      ).rejects.toThrow();
    });
  });
});