import { OrderController } from "../controllers/OrderController";
import router, { type BunRequest } from "./router";

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
 *             $ref: '#/components/schemas/CreateOrderRequest'
 *
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
 */
router.add("GET", `/${APP_VERSION}/orders`, async (request: BunRequest) => {
  return controller.getAllOrders(request);
});

router.add("POST", `/${APP_VERSION}/orders`, async (request: BunRequest) => {
  return controller.createOrder(request);
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
 */
router.add(
  "POST",
  `/${APP_VERSION}/orders/:id/cancel`,
  async (request: BunRequest) => {
    return controller.cancelOrder(request);
  }
);
