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
 * /v1/deliveries/custom:
 *   post:
 *     summary: Create a custom delivery for chat-bot delivery system
 *     tags: [Deliveries]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - pickupAddress
 *               - deliveryAddress
 *               - price
 *               - estimatedDeliveryDate
 *             properties:
 *               customerId:
 *                 type: number
 *                 description: Customer ID (optional)
 *               businessId:
 *                 type: number
 *                 description: Business ID (optional)
 *               itemDescription:
 *                 type: string
 *                 description: Description of items to be delivered
 *                 example: "Documents and small package"
 *               pickupAddress:
 *                 type: string
 *                 description: Address where items will be picked up
 *               deliveryAddress:
 *                 type: string
 *                 description: Address where items will be delivered
 *               urgency:
 *                 type: string
 *                 enum: [low, medium, high]
 *                 default: medium
 *               price:
 *                 type: number
 *                 description: Admin-set fixed price for delivery
 *               estimatedDeliveryDate:
 *                 type: string
 *                 format: date-time
 *               metadata:
 *                 type: object
 *                 description: Additional metadata
 *     responses:
 *       201:
 *         description: Custom delivery created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: number
 *                     trackingNumber:
 *                       type: string
 *                     status:
 *                       type: string
 *                     customerId:
 *                       type: number
 *                     businessId:
 *                       type: number
 *                     pickupAddress:
 *                       type: string
 *                     deliveryAddress:
 *                       type: string
 *                     urgency:
 *                       type: string
 *                     price:
 *                       type: number
 *                     estimatedDeliveryDate:
 *                       type: string
 *                       format: date-time
 *                     metadata:
 *                       type: object
 *       400:
 *         description: Invalid request
 */
router.add(
  "POST",
  `/${APP_VERSION}/deliveries/custom`,
  async (request: BunRequest) => {
    const result = await controller.createCustomDelivery(request);
    return new Response(JSON.stringify(result.body), {
      headers: { "Content-Type": "application/json" },
      status: result.statusCode,
    });
  }
);

/**
 * @swagger
 * /v1/deliveries/{id}/accept:
 *   post:
 *     summary: Business accepts a custom delivery
 *     tags: [Deliveries]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Delivery ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - businessId
 *             properties:
 *               businessId:
 *                 type: number
 *                 description: ID of the business accepting the delivery
 *     responses:
 *       200:
 *         description: Delivery accepted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: number
 *                     trackingNumber:
 *                       type: string
 *                     status:
 *                       type: string
 *                       enum: [confirmed]
 *                     businessId:
 *                       type: number
 *                     customerId:
 *                       type: number
 *                     pickupAddress:
 *                       type: string
 *                     deliveryAddress:
 *                       type: string
 *                     urgency:
 *                       type: string
 *                     price:
 *                       type: number
 *                     estimatedDeliveryDate:
 *                       type: string
 *                       format: date-time
 *                     metadata:
 *                       type: object
 *                     trackingUpdates:
 *                       type: array
 *                       items:
 *                         type: object
 *       400:
 *         description: Invalid request or delivery cannot be accepted
 *       404:
 *         description: Delivery not found
 */
router.add(
  "POST",
  `/${APP_VERSION}/deliveries/:id/accept`,
  async (request: BunRequest) => {
    const result = await controller.acceptDeliveryByBusiness(request);
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
