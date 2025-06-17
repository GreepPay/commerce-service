import {
  describe,
  it,
  expect,
  beforeAll,
  afterAll,
  beforeEach,
} from "bun:test";
import { DataSource } from "typeorm";
import { DeliveryService } from "../services/DeliveryService";
import { Delivery } from "../models/Delivery";
import { Order } from "../models/Order";
import { Sale } from "../models/Sale";

describe("DeliveryService Tests", () => {
  let dataSource: DataSource;
  let deliveryService: DeliveryService;
  let testOrder: Order;
  let testDelivery: Delivery;

  beforeAll(async () => {
    dataSource = new DataSource({
      type: "sqlite",
      database: ":memory:",
      entities: [Delivery, Order, Sale],
      synchronize: true,
      logging: false,
    });

    await dataSource.initialize();
    deliveryService = new DeliveryService();
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  beforeEach(async () => {
    await dataSource.getRepository(Delivery).clear();
    await dataSource.getRepository(Order).clear();
    await dataSource.getRepository(Sale).clear();

    testOrder = await dataSource.getRepository(Order).save(
      Object.assign(new Order(), {
        orderNumber: "ORD-001",
        customerId: 1,
        items: [],
        subtotalAmount: 1000,
        taxAmount: 0,
        discountAmount: 0,
        totalAmount: 1000,
        currency: "USD",
        status: "pending",
        shippingAddress: "123 Test Ave",
        billingAddress: "123 Test Ave",
        paymentMethod: "card",
        paymentStatus: "pending",
        appliedDiscounts: [],
        taxDetails: [],
        statusHistory: [],
      })
    );

    testDelivery = await deliveryService.createDelivery({
      orderId: testOrder.id,
      provider: "DHL",
      trackingNumber: "TRACK123",
      status: "pending",
      estimatedDeliveryDate: new Date("2025-07-01"),
      deliveryAddress: "123 Test Street",
    });
  });

  describe("createDelivery", () => {
    it("should create a new delivery successfully", async () => {
      const delivery = await deliveryService.createDelivery({
        orderId: testOrder.id,
        provider: "FedEx",
        trackingNumber: "FEDEX001",
        status: "shipped",
        estimatedDeliveryDate: new Date("2025-07-10"),
        deliveryAddress: "456 Sample Blvd",
      });

      expect(delivery).toBeInstanceOf(Delivery);
      expect(delivery.trackingNumber).toBe("FEDEX001");
      expect(delivery.status).toBe("shipped");
    });
  });

  describe("updateDeliveryStatus", () => {
    it("should update the delivery status successfully", async () => {
      const updated = await deliveryService.updateDeliveryStatus(
        `${testDelivery.id}`,
        "delivered"
      );

      expect(updated.status).toBe("delivered");
    });

    it("should throw 404 when delivery does not exist", async () => {
      await expect(
        deliveryService.updateDeliveryStatus("9999", "cancelled")
      ).rejects.toMatchObject({
        status: 404,
        message: "Delivery not found",
      });
    });
  });

  describe("updateTrackingInformation", () => {
    it("should add a new tracking update", async () => {
      const info = { status: "in transit", timestamp: new Date(), location: "Lagos" };

      const updated = await deliveryService.updateTrackingInformation(
        `${testDelivery.id}`,
        info
      );

      expect(updated.trackingUpdates?.length).toBe(1);
      expect(updated.trackingUpdates?.[0].status).toBe("in transit");
    });

    it("should append multiple tracking updates", async () => {
      const update1 = { status: "left facility", timestamp: new Date(), location: "Ikeja" };
      const update2 = { status: "arrived at hub", timestamp: new Date(), location: "Lekki" };

      await deliveryService.updateTrackingInformation(`${testDelivery.id}`, update1);
      const updated = await deliveryService.updateTrackingInformation(`${testDelivery.id}`, update2);

      expect(updated.trackingUpdates?.length).toBe(1);
    });

    it("should throw 404 if delivery not found for tracking", async () => {
      await expect(
        deliveryService.updateTrackingInformation("9999", {
          status: "dispatched",
          timestamp: new Date(),
        })
      ).rejects.toMatchObject({
        status: 404,
        message: "Delivery not found",
      });
    });
  });

  describe("Delivery entity model", () => {
    it("can instantiate Delivery and access properties", () => {
      const delivery = new Delivery();
      delivery.status = "in_transit";
      delivery.trackingNumber = "XYZ";

      expect(delivery.status).toBe("in_transit");
      expect(delivery.trackingNumber).toBe("XYZ");
    });
  });
});