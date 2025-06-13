// import {
//   describe,
//   it,
//   expect,
//   beforeAll,
//   afterAll,
//   beforeEach,
// } from "bun:test";
// import { DataSource } from "typeorm";
// import { Delivery } from "../models/Delivery";
// import { DeliveryService } from "../services/DeliveryService";
// import { AppDataSource } from "../data-source";

// let dataSource: DataSource;
// let deliveryService: DeliveryService;
// let testDelivery: Delivery;

// describe("DeliveryService", () => {
//   beforeAll(async () => {
//     dataSource = new DataSource({
//       type: "sqlite",
//       database: ":memory:",
//       entities: [Delivery],
//       synchronize: true,
//       logging: false,
//       dropSchema: true,
//     });
//     await dataSource.initialize();
//     Object.assign(AppDataSource, dataSource);

//     deliveryService = new DeliveryService();
//   });

//   afterAll(async () => {
//     await dataSource.destroy();
//   });

//   beforeEach(async () => {
//     try {
//       const deliveryRepository = dataSource.getRepository(Delivery);
//       await deliveryRepository.clear();
//     } catch (error) {
//       console.warn("Repository clear failed:", error);
//     }

//     // Create test delivery
//     const delivery = new Delivery();
//     delivery.orderId = "test-order-123";
//     delivery.recipientName = "John Doe";
//     delivery.recipientAddress = "123 Test Street";
//     delivery.status = "pending";
//     delivery.trackingUpdates = [];
//     testDelivery = await delivery.save();
//   });

//   describe("createDelivery", () => {
//     it("should create a new delivery successfully", async () => {
//       const deliveryData = {
//         orderId: "order-456",
//         recipientName: "Jane Smith",
//         recipientAddress: "456 Main St",
//         status: "pending",
//         trackingUpdates: [],
//       };

//       const result = await deliveryService.createDelivery(deliveryData);

//       expect(result.success).toBe(true);
//       expect(result.message).toBe("Delivery created successfully");
//       expect(result.data).toBeDefined();
//       expect(result.data.orderId).toBe("order-456");
//       expect(result.data.recipientName).toBe("Jane Smith");
//       expect(result.data.status).toBe("pending");
//     });

//     it("should handle creation with minimal data", async () => {
//       const deliveryData = {
//         orderId: "order-minimal",
//         status: "pending",
//       };

//       const result = await deliveryService.createDelivery(deliveryData);

//       expect(result.success).toBe(true);
//       expect(result.data.orderId).toBe("order-minimal");
//       expect(result.data.status).toBe("pending");
//     });
//   });

//   describe("updateDeliveryStatus", () => {
//     it("should update delivery status successfully", async () => {
//       const newStatus = "in_transit";

//       const result = await deliveryService.updateDeliveryStatus(
//         testDelivery.id,
//         newStatus
//       );

//       expect(result.success).toBe(true);
//       expect(result.message).toBe("Delivery status updated successfully");
//       expect(result.data.status).toBe(newStatus);
//       expect(result.data.id).toBe(testDelivery.id);
//     });

//     it("should return not found for non-existent delivery", async () => {
//       const nonExistentId = "non-existent-id";
//       const newStatus = "delivered";

//       const result = await deliveryService.updateDeliveryStatus(
//         nonExistentId,
//         newStatus
//       );

//       expect(result.success).toBe(false);
//       expect(result.message).toBe("Delivery not found");
//       expect(result.statusCode).toBe(404);
//     });

//     it("should update status to delivered", async () => {
//       const result = await deliveryService.updateDeliveryStatus(
//         testDelivery.id,
//         "delivered"
//       );

//       expect(result.success).toBe(true);
//       expect(result.data.status).toBe("delivered");
//     });
//   }); 

//   describe("updateTrackingInformation", () => {
//     it("should update tracking information successfully", async () => {
//       const trackingInfo = {
//         timestamp: new Date().toISOString(),
//         location: "Distribution Center",
//         status: "In Transit",
//         description: "Package has left the distribution center",
//       };

//       const result = await deliveryService.updateTrackingInformation(
//         testDelivery.id,
//         trackingInfo
//       );

//       expect(result.success).toBe(true);
//       expect(result.message).toBe("Tracking information updated successfully");
//       expect(result.data.trackingUpdates).toBeDefined();
//       expect(Array.isArray(result.data.trackingUpdates)).toBe(true);
//       expect(result.data.trackingUpdates.length).toBe(1);
//       expect(result.data.trackingUpdates[0]).toEqual(trackingInfo);
//     });

//     it("should append multiple tracking updates", async () => {
//       const trackingInfo1 = {
//         timestamp: new Date().toISOString(),
//         location: "Warehouse",
//         status: "Picked Up",
//         description: "Package picked up from warehouse",
//       };

//       const trackingInfo2 = {
//         timestamp: new Date().toISOString(),
//         location: "Distribution Center",
//         status: "In Transit",
//         description: "Package at distribution center",
//       };

//       // Add first tracking update
//       await deliveryService.updateTrackingInformation(testDelivery.id, trackingInfo1);
      
//       // Add second tracking update
//       const result = await deliveryService.updateTrackingInformation(
//         testDelivery.id,
//         trackingInfo2
//       );

//       expect(result.success).toBe(true);
//       expect(result.data.trackingUpdates.length).toBe(2);
//       expect(result.data.trackingUpdates[0]).toEqual(trackingInfo1);
//       expect(result.data.trackingUpdates[1]).toEqual(trackingInfo2);
//     });

//     it("should handle delivery with null trackingUpdates", async () => {
//       // Create delivery with null trackingUpdates
//       const delivery = new Delivery();
//       delivery.orderId = "order-null-tracking";
//       delivery.status = "pending";
//       delivery.trackingUpdates = null;
//       const savedDelivery = await delivery.save();

//       const trackingInfo = {
//         timestamp: new Date().toISOString(),
//         location: "Warehouse",
//         status: "Picked Up",
//       };

//       const result = await deliveryService.updateTrackingInformation(
//         savedDelivery.id,
//         trackingInfo
//       );

//       expect(result.success).toBe(true);
//       expect(result.data.trackingUpdates).toBeDefined();
//       expect(Array.isArray(result.data.trackingUpdates)).toBe(true);
//       expect(result.data.trackingUpdates.length).toBe(1);
//       expect(result.data.trackingUpdates[0]).toEqual(trackingInfo);
//     });

//     it("should return not found for non-existent delivery", async () => {
//       const nonExistentId = "non-existent-id";
//       const trackingInfo = {
//         timestamp: new Date().toISOString(),
//         status: "Delivered",
//       };

//       const result = await deliveryService.updateTrackingInformation(
//         nonExistentId,
//         trackingInfo
//       );

//       expect(result.success).toBe(false);
//       expect(result.message).toBe("Delivery not found");
//       expect(result.statusCode).toBe(404);
//     });
//   });
// });