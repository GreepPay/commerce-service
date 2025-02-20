import { SaleController } from "../controllers/SaleController";
import router, { type BunRequest } from "./router";

const APP_VERSION = "v1";
const controller = new SaleController();

/**
 * @swagger
 * /v1/sales/process:
 *   post:
 *     summary: Process a new sale
 *     tags: [Sales]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProcessSaleRequest'
 */
router.add("POST", `/${APP_VERSION}/sales/process`, async (request: BunRequest) => {
  return controller.processSale(request);
});

/**
 * @swagger
 * /v1/sales/{id}/refund:
 *   post:
 *     summary: Initiate a refund for a sale
 *     tags: [Sales]
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
 *               - amount
 *               - reason
 *             properties:
 *               amount:
 *                 type: number
 *               reason:
 *                 type: string
 */
router.add("POST", `/${APP_VERSION}/sales/:id/refund`, async (request: BunRequest) => {
  return controller.processSaleRefund(request);
});

/**
 * @swagger
 * /v1/discounts/apply:
 *   post:
 *     summary: Apply a discount code to a sale
 *     tags: [Sales]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *             properties:
 *               code:
 *                 type: string
 */
router.add("POST", `/${APP_VERSION}/discounts/apply`, async (request: BunRequest) => {
  return controller.validateDiscountCode(request);
});

/**
 * @swagger
 * /v1/taxes/calculate:
 *   post:
 *     summary: Calculate taxes for a cart (pre-checkout)
 *     tags: [Sales]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TaxCalculationRequest'
 */
router.add("POST", `/${APP_VERSION}/taxes/calculate`, async (request: BunRequest) => {
  return controller.calculateTaxes(request);
});

/**
 * @swagger
 * /v1/sales:
 *   get:
 *     summary: List all sales (with date/customer filters)
 *     tags: [Sales]
 *     parameters:
 *       - in: query
 *         name: customerId
 *         schema:
 *           type: string
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, completed, refunded, partially_refunded, cancelled]
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
router.add("GET", `/${APP_VERSION}/sales`, async (request: BunRequest) => {
  return controller.getSales(request);
});

/**
 * @swagger
 * /v1/customers/{id}/sales:
 *   get:
 *     summary: Fetch sales history for a customer
 *     tags: [Sales]
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
 *           enum: [pending, completed, refunded, partially_refunded, cancelled]
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
router.add("GET", `/${APP_VERSION}/customers/:id/sales`, async (request: BunRequest) => {
  return controller.getCustomerSales(request);
});
