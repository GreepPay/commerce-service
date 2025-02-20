import { DeliveryController } from "../controllers/DeliveryController";
import router, { type BunRequest } from "./router";

const APP_VERSION = "v1";
const controller = new DeliveryController();

/**
 * @swagger
 * /v1/deliveries:
 *   post:
 *     summary: Create a new delivery
 *     tags: [Deliveries]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               orderId:
 *                 type: string
 *               trackingNumber:
 *                 type: string
 *               estimatedDeliveryDate:
 *                 type: string
 *                 format: date-time
 *               deliveryAddress:
 *                 type: string
 */
router.add("POST", `/${APP_VERSION}/deliveries`, async (request: BunRequest) => {
  return controller.createDelivery(request);
});

/**
 * @swagger
 * /v1/deliveries/{id}/status:
 *   patch:
 *     summary: Update delivery status
 *     tags: [Deliveries]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 */
router.add("PATCH", `/${APP_VERSION}/deliveries/:id/status`, async (request: BunRequest) => {
  return controller.updateDeliveryStatus(request);
});

/**
 * @swagger
 * /v1/deliveries/{id}:
 *   get:
 *     summary: Get delivery details
 *     tags: [Deliveries]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 */
router.add("GET", `/${APP_VERSION}/deliveries/:id`, async (request: BunRequest) => {
  return controller.getDeliveryDetails(request);
});

/**
 * @swagger
 * /v1/orders/{id}/deliveries:
 *   get:
 *     summary: Get all deliveries for an order
 *     tags: [Deliveries]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 */
router.add("GET", `/${APP_VERSION}/orders/:id/deliveries`, async (request: BunRequest) => {
  return controller.getOrderDeliveries(request);
});

/**
 * @swagger
 * /v1/deliveries/{id}/tracking:
 *   post:
 *     summary: Update tracking information for a delivery
 *     tags: [Deliveries]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               timestamp:
 *                 type: string
 *                 format: date-time
 *               status:
 *                 type: string
 *               location:
 *                 type: string
 */
router.add("POST", `/${APP_VERSION}/deliveries/:id/tracking`, async (request: BunRequest) => {
  return controller.updateTrackingInformation(request);
});
