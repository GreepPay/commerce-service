import { OrderController } from "../controllers/OrderController";
import router, { type BunRequest } from "./router";
import { OrderStatus, PaymentStatus } from "../models/Order";

const APP_VERSION = "v1";
const controller = new OrderController();

/**
 * @swagger
 * /v1/orders:
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - customerId
 *               - items
 *               - shippingAddress
 *               - billingAddress
 *             properties:
 *               customerId:
 *                 type: string
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - productId
 *                     - quantity
 *                     - price
 *                   properties:
 *                     productId:
 *                       type: string
 *                     sku:
 *                       type: string
 *                     quantity:
 *                       type: number
 *                     price:
 *                       type: number
 *               shippingAddress:
 *                 $ref: '#/components/schemas/Address'
 *               billingAddress:
 *                 $ref: '#/components/schemas/Address'
 *               paymentMethod:
 *                 type: string
 *     responses:
 *       201:
 *         description: Order created successfully
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
 *                     order:
 *                       $ref: '#/components/schemas/Order'
 *                     sale:
 *                       $ref: '#/components/schemas/Sale'
 *                     delivery:
 *                       $ref: '#/components/schemas/Delivery'
 *       400:
 *         description: Invalid request or validation error
 */
router.add("POST", `/${APP_VERSION}/orders`, async (request: BunRequest) => {
  const result = await controller.createOrder(request);
  return new Response(JSON.stringify(result.body), {
    headers: { "Content-Type": "application/json" },
    status: result.statusCode,
  });
});

/**
 * @swagger
 * /v1/orders:
 *   get:
 *     summary: Get all orders
 *     tags: [Orders]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, confirmed, processing, shipped, delivered, cancelled, refunded]
 *       - in: query
 *         name: fromDate
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: toDate
 *         schema:
 *           type: string
 *           format: date-time
 *     responses:
 *       200:
 *         description: List of orders retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Order'
 */
router.add("GET", `/${APP_VERSION}/orders`, async (request: BunRequest) => {
  return controller.getAllOrders(request);
});

/**
 * @swagger
 * /v1/orders/{id}:
 *   get:
 *     summary: Get order by ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Order'
 *       404:
 *         description: Order not found
 */
router.add("GET", `/${APP_VERSION}/orders/:id`, async (request: BunRequest) => {
  return controller.getOrderById(request);
});

/**
 * @swagger
 * /v1/customers/{id}/orders:
 *   get:
 *     summary: Get all orders for a customer
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, confirmed, processing, shipped, delivered, cancelled, refunded]
 *       - in: query
 *         name: fromDate
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: toDate
 *         schema:
 *           type: string
 *           format: date-time
 *     responses:
 *       200:
 *         description: Customer orders retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Order'
 */
router.add(
  "GET",
  `/${APP_VERSION}/customers/:id/orders`,
  async (request: BunRequest) => {
    return controller.getCustomerOrders(request);
  }
);

/**
 * @swagger
 * /v1/orders/{id}/status:
 *   patch:
 *     summary: Update order status
 *     tags: [Orders]
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
 *                 enum: [pending, confirmed, processing, shipped, delivered, cancelled, refunded]
 *               note:
 *                 type: string
 *     responses:
 *       200:
 *         description: Order status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Order'
 *       400:
 *         description: Invalid status transition
 *       404:
 *         description: Order not found
 */
router.add(
  "PATCH",
  `/${APP_VERSION}/orders/:id/status`,
  async (request: BunRequest) => {
    return controller.updateOrderStatus(request);
  }
);

/**
 * @swagger
 * /v1/orders/{id}/cancel:
 *   post:
 *     summary: Cancel an order (triggers refund and inventory restock)
 *     tags: [Orders]
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
 *               - reason
 *             properties:
 *               reason:
 *                 type: string
 *                 description: Reason for cancellation
 *     responses:
 *       200:
 *         description: Order cancelled successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Order'
 *       400:
 *         description: Cannot cancel order in current status
 *       404:
 *         description: Order not found
 */
router.add(
  "POST",
  `/${APP_VERSION}/orders/:id/cancel`,
  async (request: BunRequest) => {
    return controller.cancelOrder(request);
  }
);

/**
 * @swagger
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         orderNumber:
 *           type: string
 *         customer:
 *           $ref: '#/components/schemas/Customer'
 *         sale:
 *           $ref: '#/components/schemas/Sale'
 *         items:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               product:
 *                 $ref: '#/components/schemas/Product'
 *               quantity:
 *                 type: number
 *               price:
 *                 type: number
 *               taxRate:
 *                 type: number
 *               taxAmount:
 *                 type: number
 *               discountAmount:
 *                 type: number
 *               total:
 *                 type: number
 *         subtotalAmount:
 *           type: number
 *         taxAmount:
 *           type: number
 *         discountAmount:
 *           type: number
 *         totalAmount:
 *           type: number
 *         currency:
 *           type: string
 *         status:
 *           type: string
 *           enum: [pending, confirmed, processing, shipped, delivered, cancelled, refunded]
 *         paymentStatus:
 *           type: string
 *           enum: [pending, authorized, paid, failed, refunded, partially_refunded]
 *         shippingAddress:
 *           $ref: '#/components/schemas/Address'
 *         billingAddress:
 *           $ref: '#/components/schemas/Address'
 *         deliveries:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Delivery'
 *         statusHistory:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *               timestamp:
 *                 type: string
 *                 format: date-time
 *               note:
 *                 type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     Address:
 *       type: object
 *       properties:
 *         street:
 *           type: string
 *         city:
 *           type: string
 *         state:
 *           type: string
 *         postalCode:
 *           type: string
 *         country:
 *           type: string
 *         phone:
 *           type: string
 */
