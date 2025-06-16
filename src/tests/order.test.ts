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

describe("OrderService", () => {
  let dataSource: DataSource;
  let orderService: OrderService;
  let productService: ProductService;
  let testProduct: Product;

  beforeAll(async () => {
    dataSource = new DataSource({
      type: "sqlite",
      database: ":memory:",
      entities: [OrderModel, Delivery, Product, Category, Sale],
      synchronize: true,
      logging: false,
    });
    await dataSource.initialize();

    const saleService = new SaleService();
    const ticketService = new TicketService();
    const deliveryService = {}; // stub — not directly used in createOrder

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
    await dataSource.getRepository(OrderModel).clear();
    await dataSource.getRepository(Delivery).clear();
    await dataSource.getRepository(Product).clear();
    await dataSource.getRepository(Category).clear();

    const category = dataSource.getRepository(Category).create({
      name: "electronics",
      slug: "electronics",
    });
    await dataSource.getRepository(Category).save(category);

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

  it("should create order using real services", async () => {
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
  });
});