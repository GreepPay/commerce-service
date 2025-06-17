import { DeliveryController } from "../controllers/DeliveryController";
import router, { type BunRequest } from "./router";
import { DeliveryStatus } from "../forms/delivery";

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
 *             required:
 *               - orderId
 *               - trackingNumber
 *               - estimatedDeliveryDate
 *               - deliveryAddress
 *             properties:
 *               orderId:
 *                 type: string
 *               trackingNumber:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [pending, processing, label_created, shipped, in_transit, out_for_delivery, delivered, failed, failed_attempt, returned, return_to_sender]
 *               estimatedDeliveryDate:
 *                 type: string
 *                 format: date-time
 *               deliveryAddress:
 *                 $ref: '#/components/schemas/Address'
 *     responses:
 *       201:
 *         description: Delivery created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Delivery'
 *       400:
 *         description: Invalid request
 */

router.add(
  "POST",
  `/${APP_VERSION}/deliveries`,
  async (request: BunRequest) => {
    const result = await controller.createDelivery(request);
    return new Response(JSON.stringify(result.body), {
      headers: { "Content-Type": "application/json" },
      status: result.statusCode,
    });
  }
);

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
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, processing, label_created, shipped, in_transit, out_for_delivery, delivered, failed, failed_attempt, returned, return_to_sender]
 *     responses:
 *       200:
 *         description: Delivery status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Delivery'
 *       404:
 *         description: Delivery not found
 */

router.add(
  "PUT",
  `/${APP_VERSION}/deliveries/:id/status`,
  async (request: BunRequest) => {
    const result = await controller.updateDeliveryStatus(request);
    return new Response(JSON.stringify(result.body), {
      headers: { "Content-Type": "application/json" },
      status: result.statusCode,
    });
  }
);

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
 *             required:
 *               - timestamp
 *               - status
 *               - location
 *             properties:
 *               timestamp:
 *                 type: string
 *                 format: date-time
 *               status:
 *                 type: string
 *                 enum: [pending, processing, label_created, shipped, in_transit, out_for_delivery, delivered, failed, failed_attempt, returned, return_to_sender]
 *               location:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Tracking information updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Delivery'
 *       404:
 *         description: Delivery not found
 */
router.add(
  "POST",
  `/${APP_VERSION}/deliveries/:id/tracking`,
  async (request: BunRequest) => {
    const result = await controller.updateDeliveryStatus(request);
    return new Response(JSON.stringify(result.body), {
      headers: { "Content-Type": "application/json" },
      status: result.statusCode,
    });
  }
);

/**
 * @swagger
 * components:
 *   schemas:
 *     Delivery:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         order:
 *           $ref: '#/components/schemas/Order'
 *         trackingNumber:
 *           type: string
 *         status:
 *           type: string
 *           enum: [pending, processing, label_created, shipped, in_transit, out_for_delivery, delivered, failed, failed_attempt, returned, return_to_sender]
 *         estimatedDeliveryDate:
 *           type: string
 *           format: date-time
 *         actualDeliveryDate:
 *           type: string
 *           format: date-time
 *         deliveryAddress:
 *           $ref: '#/components/schemas/Address'
 *         trackingUpdates:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               timestamp:
 *                 type: string
 *                 format: date-time
 *               status:
 *                 type: string
 *               location:
 *                 type: string
 *               description:
 *                 type: string
 *         deliveryAttempts:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               attemptDate:
 *                 type: string
 *                 format: date-time
 *               status:
 *                 type: string
 *               notes:
 *                 type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */
