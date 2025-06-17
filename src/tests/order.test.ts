import {
  describe,
  it,
  expect,
  beforeAll,
  afterAll,
  beforeEach,
} from "bun:test";
import { DataSource } from "typeorm";
import { OrderService } from "../services/OrderService";
import { ProductService } from "../services/ProductService";
import { SaleService } from "../services/SaleService";
import { TicketService } from "../services/TicketService";
import { Order as OrderModel } from "../models/Order";
import { Product } from "../models/Product";
import { Delivery } from "../models/Delivery";
import { Category } from "../models/Category";
import { ProductStatus, ProductType } from "../forms/products";
import { type Order as OrderForm } from "../forms/orders";
import { Sale } from "../models/Sale";
import { OrderStatus, PaymentStatus } from "../models/Order";

describe("OrderService", () => {
  let dataSource: DataSource;
  let orderService: OrderService;
  let productService: ProductService;
  let testProduct: Product;
  let testOrder: OrderModel;

  beforeAll(async () => {
    dataSource = new DataSource({
      type: "sqlite",
      database: ":memory:",
      entities: [OrderModel, Delivery, Product, Category, Sale],
      synchronize: true,
      logging: false,
      // Add foreign key support for SQLite
      extra: {
        pragma: "foreign_keys = ON"
      }
    });
    await dataSource.initialize();

    const saleService = new SaleService();
    const ticketService = new TicketService();
    const deliveryService = {}; // stub for now

    orderService = new OrderService(
      saleService,
      deliveryService as any,
      ticketService
    );
    productService = new ProductService();
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  beforeEach(async () => {
    // Clear tables in the correct order to avoid foreign key constraint violations
    // Start with child tables first, then parent tables
    
    // First, disable foreign key checks temporarily
    await dataSource.query("PRAGMA foreign_keys = OFF");
    
    try {
      // Clear in reverse dependency order
      await dataSource.getRepository(OrderModel).clear();
      await dataSource.getRepository(Sale).clear();
      await dataSource.getRepository(Delivery).clear();
      await dataSource.getRepository(Product).clear();
      await dataSource.getRepository(Category).clear();
    } finally {
      // Re-enable foreign key checks
      await dataSource.query("PRAGMA foreign_keys = ON");
    }

    // Create test category
    const category = dataSource.getRepository(Category).create({
      name: "electronics",
      slug: "electronics",
    });
    await dataSource.getRepository(Category).save(category);

    // Create test product
    testProduct = await productService.createProduct({
      name: "Reusable Product",
      sku: "sku-order-001",
      description: "Reusable product for testing",
      type: ProductType.PHYSICAL,
      status: ProductStatus.ACTIVE,
      price: 1000,
      currency: "USD",
      businessId: 1,
      categoryIds: [],
      tags: [],
      inventoryCount: 10,
    });
  });

  it("should create orders", async () => {
    const orderData: OrderForm = {
      customerId: 456,
      paymentMethod: "card",
      shippingAddress: { street: "Test St" },
      billingAddress: { street: "Test St" },
      items: [
        {
          productId: testProduct.id,
          quantity: 2,
          price: 1000,
          total: 2000,
        },
      ],
    };

    const result = await orderService.createOrder(orderData);

    expect(result).toHaveProperty("order");
    expect(result).toHaveProperty("sale");
    expect(result).toHaveProperty("delivery");

    expect(result.order.orderNumber).toMatch(/^ORD-/);
    expect(result.sale.totalAmount).toBeGreaterThan(0);
    expect(result.delivery.trackingNumber).toMatch(/^TRK-/);

    testOrder = result.order;
  });

  // it("should throw an error if a product does not exist", async () => {
  //   const orderData: OrderForm = {
  //     customerId: 123,
  //     paymentMethod: "card",
  //     shippingAddress: { street: "Nowhere" },
  //     billingAddress: { street: "Nowhere" },
  //     items: [
  //       {
  //         productId: "non-existent-id",
  //         quantity: 1,
  //         price: 500,
  //         total: 500,
  //       },
  //     ],
  //   };

  //   await expect(orderService.createOrder(orderData)).rejects.toMatchObject({
  //       status: 404,
  //       message: "Product not found",
  //     });
  // });

  // it("should fail if ordered quantity exceeds product inventory", async () => {
  //   // Update the product directly using the repository to avoid potential issues
  //   await dataSource.getRepository(Product).update(testProduct.id, { inventoryCount: 1 });

  //   const orderData: OrderForm = {
  //     customerId: 999,
  //     paymentMethod: "card",
  //     shippingAddress: { street: "Shortage Ave" },
  //     billingAddress: { street: "Shortage Ave" },
  //     items: [
  //       {
  //         productId: testProduct.id,
  //         quantity: 2,
  //         price: 1000,
  //         total: 2000,
  //       },
  //     ],
  //   };

  //   await expect(orderService.createOrder(orderData)).rejects.toThrow(
  //     /Insufficient inventory/i
  //   );
  // });

  it("should reduce product inventory after successful order", async () => {
    const initialInventory = testProduct.inventoryCount;

    const orderData: OrderForm = {
      customerId: 111,
      paymentMethod: "card",
      shippingAddress: { street: "Inventory Lane" },
      billingAddress: { street: "Inventory Lane" },
      items: [
        {
          productId: testProduct.id,
          quantity: 3,
          price: 1000,
          total: 3000,
        },
      ],
    };

    await orderService.createOrder(orderData);
    
    // Use repository to find the updated product
    const updatedProduct = await dataSource.getRepository(Product).findOneByOrFail({ id: testProduct.id });

    expect(updatedProduct.inventoryCount).toBe(initialInventory - 3);
  });

  it("should calculate total and tax amount correctly", async () => {
    const orderData: OrderForm = {
      customerId: 321,
      paymentMethod: "card",
      shippingAddress: { street: "Total Rd" },
      billingAddress: { street: "Total Rd" },
      items: [
        {
          productId: testProduct.id,
          quantity: 1,
          price: 1000,
          total: 1000,
        },
      ],
    };

    const result = await orderService.createOrder(orderData);

    expect(result.sale.subtotalAmount).toBe(1000);
    expect(result.sale.totalAmount).toBeGreaterThanOrEqual(1000);
  });

  it("should assign pending status to new orders", async () => {
    const orderData: OrderForm = {
      customerId: 777,
      paymentMethod: "card",
      shippingAddress: { street: "Status Blvd" },
      billingAddress: { street: "Status Blvd" },
      items: [
        {
          productId: testProduct.id,
          quantity: 1,
          price: 1000,
          total: 1000,
        },
      ],
    };

    const result = await orderService.createOrder(orderData);

    expect(result.order.status).toBe(OrderStatus.PENDING);
    expect(result.order.paymentStatus).toBe(PaymentStatus.PENDING);
  });

  it("should update order status", async () => {
    const orderData: OrderForm = {
      customerId: 888,
      paymentMethod: "card",
      shippingAddress: { street: "Status Test" },
      billingAddress: { street: "Status Test" },
      items: [
        {
          productId: testProduct.id,
          quantity: 1,
          price: 1000,
          total: 1000,
        },
      ],
    };

    const { order } = await orderService.createOrder(orderData);
    const updated = await orderService.updateOrderStatus(order.id, OrderStatus.CONFIRMED, "Confirmed by admin");

    expect(updated.status).toBe(OrderStatus.CONFIRMED);
    expect(updated.statusHistory.at(-1)?.note).toContain("Confirmed by admin");
  });

  it("should cancel an order successfully", async () => {
    const orderData: OrderForm = {
      customerId: 999,
      paymentMethod: "card",
      shippingAddress: { street: "Cancel St" },
      billingAddress: { street: "Cancel St" },
      items: [
        {
          productId: testProduct.id,
          quantity: 1,
          price: 1000,
          total: 1000,
        },
      ],
    };

    const { order } = await orderService.createOrder(orderData);
    const cancelled = await orderService.cancelOrder(order.id, "Customer changed mind");

    expect(cancelled.status).toBe(OrderStatus.CANCELLED);
    expect(cancelled.statusHistory.at(-1)?.note).toContain("Customer changed mind");
  });
});