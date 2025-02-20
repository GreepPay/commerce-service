import { SaleController } from "../controllers/SaleController";
import router, { type BunRequest } from "./router";
import { SaleStatus, PaymentMethod } from "../models/Sale";

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
 *             type: object
 *             required:
 *               - customerId
 *               - items
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
 *                   properties:
 *                     productId:
 *                       type: string
 *                     quantity:
 *                       type: number
 *               paymentMethod:
 *                 type: string
 *                 enum: [credit_card, debit_card, bank_transfer, digital_wallet, cash]
 *               discountCodes:
 *                 type: array
 *                 items:
 *                   type: string
 *               metadata:
 *                 type: object
 *     responses:
 *       201:
 *         description: Sale processed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Sale'
 *       400:
 *         description: Invalid request or insufficient inventory
 */
router.add(
  "POST",
  `/${APP_VERSION}/sales/process`,
  async (request: BunRequest) => {
    return controller.processSale(request);
  }
);

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
 *                 description: Amount to refund
 *               reason:
 *                 type: string
 *                 description: Reason for refund
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Refund processed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Sale'
 *       400:
 *         description: Invalid refund amount or sale already refunded
 *       404:
 *         description: Sale not found
 */
router.add(
  "POST",
  `/${APP_VERSION}/sales/:id/refund`,
  async (request: BunRequest) => {
    return controller.processSaleRefund(request);
  }
);

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
 *     responses:
 *       200:
 *         description: Discount code validated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Discount'
 *       400:
 *         description: Invalid or expired discount code
 */
router.add(
  "POST",
  `/${APP_VERSION}/discounts/apply`,
  async (request: BunRequest) => {
    return controller.validateDiscountCode(request);
  }
);

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
 *             type: object
 *             required:
 *               - items
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - productId
 *                     - quantity
 *                   properties:
 *                     productId:
 *                       type: string
 *                     quantity:
 *                       type: number
 *     responses:
 *       200:
 *         description: Tax calculation completed
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
 *                     items:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/SaleItem'
 *                     taxDetails:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/TaxDetail'
 *                     totalTax:
 *                       type: number
 */
router.add(
  "POST",
  `/${APP_VERSION}/taxes/calculate`,
  async (request: BunRequest) => {
    return controller.calculateTaxes(request);
  }
);

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
 *     responses:
 *       200:
 *         description: Sales retrieved successfully
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
 *                     $ref: '#/components/schemas/Sale'
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
 *     responses:
 *       200:
 *         description: Customer sales retrieved successfully
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
 *                     $ref: '#/components/schemas/Sale'
 */
router.add(
  "GET",
  `/${APP_VERSION}/customers/:id/sales`,
  async (request: BunRequest) => {
    return controller.getCustomerSales(request);
  }
);

/**
 * @swagger
 * components:
 *   schemas:
 *     Sale:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         transactionId:
 *           type: string
 *         customer:
 *           $ref: '#/components/schemas/Customer'
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/SaleItem'
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
 *           enum: [pending, completed, refunded, partially_refunded, cancelled]
 *         appliedDiscounts:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Discount'
 *         taxDetails:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/TaxDetail'
 *         paymentDetails:
 *           type: object
 *           properties:
 *             method:
 *               type: string
 *               enum: [credit_card, debit_card, bank_transfer, digital_wallet, cash]
 *             transactionDate:
 *               type: string
 *               format: date-time
 *             provider:
 *               type: string
 *             lastFourDigits:
 *               type: string
 *             receiptNumber:
 *               type: string
 *         refundDetails:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               transactionId:
 *                 type: string
 *               amount:
 *                 type: number
 *               reason:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [pending, completed, failed]
 *               refundDate:
 *                 type: string
 *                 format: date-time
 *               notes:
 *                 type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     SaleItem:
 *       type: object
 *       properties:
 *         productId:
 *           type: string
 *         sku:
 *           type: string
 *         name:
 *           type: string
 *         quantity:
 *           type: number
 *         unitPrice:
 *           type: number
 *         subtotal:
 *           type: number
 *         taxRate:
 *           type: number
 *         taxAmount:
 *           type: number
 *         discountAmount:
 *           type: number
 *         total:
 *           type: number
 *     Discount:
 *       type: object
 *       properties:
 *         code:
 *           type: string
 *         type:
 *           type: string
 *           enum: [percentage, fixed_amount]
 *         value:
 *           type: number
 *         description:
 *           type: string
 *     TaxDetail:
 *       type: object
 *       properties:
 *         type:
 *           type: string
 *         rate:
 *           type: number
 *         amount:
 *           type: number
 *         description:
 *           type: string
 */
