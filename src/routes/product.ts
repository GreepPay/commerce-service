import { ProductController } from "../controllers/ProductController";
import router, { type BunRequest } from "./router";
const APP_VERSION = "v1";

const controller = new ProductController();

/**
 * @swagger
 * /v1/products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - type
 *               - currency
 *               - businessId
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [physical, digital, subscription, event]
 *               price:
 *                 type: number
 *               status:
 *                 type: string
 *                 enum: [draft, active, archived, discontinued, out_of_stock]
 *               currency:
 *                 type: string
 *               categoryIds:
 *                 type: array
 *                 items:
 *                   type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *               businessId:
 *                 type: number
 *               inventoryCount:
 *                 type: number
 *                 description: Available quantity in stock
 *               stockThreshold:
 *                 type: number
 *               isBackorderAllowed:
 *                 type: boolean
 *
 *               # Physical-specific (optional)
 *               weight:
 *                 type: number
 *               dimensions:
 *                 type: object
 *                 properties:
 *                   length:
 *                     type: number
 *                   width:
 *                     type: number
 *                   height:
 *                     type: number
 *               shippingClass:
 *                 type: string
 *                 enum: [standard, express, oversized]
 *               inventory:
 *                 type: object
 *                 properties:
 *                   stock:
 *                     type: number
 *                   lowStockThreshold:
 *                     type: number
 *                   isBackorderAllowed:
 *                     type: boolean
 *
 *               # Digital-specific (optional)
 *               download:
 *                 type: object
 *                 properties:
 *                   url:
 *                     type: string
 *                   accessExpiration:
 *                     type: string
 *                   downloadLimit:
 *                     type: number
 *               license:
 *                 type: object
 *                 properties:
 *                   key:
 *                     type: string
 *                   type:
 *                     type: string
 *                     enum: [single, multi, perpetual]
 *               fileInfo:
 *                 type: object
 *                 properties:
 *                   size:
 *                     type: number
 *                   format:
 *                     type: string
 *
 *               # Subscription-specific (optional)
 *               billing:
 *                 type: object
 *                 properties:
 *                   interval:
 *                     type: string
 *                     enum: [monthly, annual, custom]
 *                   trialDays:
 *                     type: number
 *                   gracePeriod:
 *                     type: number
 *               features:
 *                 type: array
 *                 items:
 *                   type: string
 *               renewal:
 *                 type: object
 *                 properties:
 *                   price:
 *                     type: number
 *                   autoRenew:
 *                     type: boolean
 *
 *               # Event-specific (optional)
 *               eventType:
 *                 type: string
 *                 enum: [online, offline, hybrid]
 *               eventDetails:
 *                 type: object
 *                 properties:
 *                   startDate:
 *                     type: string
 *                   endDate:
 *                     type: string
 *                   venueName:
 *                     type: string
 *                   onlineUrl:
 *                     type: string
 *                   location:
 *                     type: object
 *                     properties:
 *                       address:
 *                         type: string
 *                       city:
 *                         type: string
 *                       state:
 *                         type: string
 *                       country:
 *                         type: string
 *                       postalCode:
 *                         type: string
 *                       coordinates:
 *                         type: object
 *                         properties:
 *                           lat:
 *                             type: number
 *                           lng:
 *                             type: number
 *                   capacity:
 *                     type: number
 *                   registeredCount:
 *                     type: number
 *                   waitlistEnabled:
 *                     type: boolean
 *     responses:
 *       201:
 *         description: Product created successfully
 *       400:
 *         description: Invalid request
 */
router.add("POST", `/${APP_VERSION}/products`, async (request: BunRequest) => {
  const result = await controller.createProduct(request);
  return new Response(JSON.stringify(result.body), {
    headers: { "Content-Type": "application/json" },
    status: result.statusCode,
  });
});

/**
 * @swagger
 * /v1/products/{id}:
 *   put:
 *     summary: Update product
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               categories:
 *                 type: array
 *                 items:
 *                   type: string
 *               metadata:
 *                 type: object
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       404:
 *         description: Product not found
 */
router.add(
  "PUT",
  `/${APP_VERSION}/products/:id`,
  async (request: BunRequest) => {
    const result = await controller.updateProduct(request);
    return new Response(JSON.stringify(result.body), {
      headers: { "Content-Type": "application/json" },
      status: result.statusCode,
    });
  }
);

/**
 * @swagger
 * /v1/products/{id}:
 *   delete:
 *     summary: Delete product
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       404:
 *         description: Product not found
 */
router.add(
  "DELETE",
  `/${APP_VERSION}/products/:id`,
  async (request: BunRequest) => {
    const result = await controller.deleteProduct(request);
    return new Response(JSON.stringify(result.body), {
      headers: { "Content-Type": "application/json" },
      status: result.statusCode,
    });
  }
);

/**
 * @swagger
 * /v1/products/{id}/inventory:
 *   patch:
 *     summary: Adjust inventory count
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - count
 *             properties:
 *               count:
 *                 type: number
 *                 description: New inventory count
 *     responses:
 *       200:
 *         description: Inventory updated successfully
 *       404:
 *         description: Product not found
 */
router.add(
  "PUT",
  `/${APP_VERSION}/products/:id/inventory`,
  async (request: BunRequest) => {
    const result = await controller.adjustInventory(request);
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
 *     Product:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         sku:
 *           type: string
 *         description:
 *           type: string
 *         price:
 *           type: number
 *         type:
 *           type: string
 *           enum: [physical, digital, service]
 *         categories:
 *           type: array
 *           items:
 *             type: string
 *         inventoryCount:
 *           type: number
 *         metadata:
 *           type: object
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */
