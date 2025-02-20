import { ProductController } from "../controllers/ProductController";
import router, { type BunRequest } from "./router";
const APP_VERSION = "v1";

const controller = new ProductController();

/**
 * @swagger
 * /v1/products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter products by category
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         description: Filter products by type
 *     responses:
 *       200:
 *         description: List of products retrieved successfully
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
 *                     $ref: '#/components/schemas/Product'
 *       400:
 *         description: Invalid request
 */
router.add("GET", `/${APP_VERSION}/products`, async (request: BunRequest) => {
  const result = await controller.getAllProducts(request);
  return result;
});

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
 *               - sku
 *               - price
 *               - type
 *             properties:
 *               name:
 *                 type: string
 *               sku:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               type:
 *                 type: string
 *                 enum: [physical, digital, service]
 *               categories:
 *                 type: array
 *                 items:
 *                   type: string
 *               inventoryCount:
 *                 type: number
 *               metadata:
 *                 type: object
 *     responses:
 *       201:
 *         description: Product created successfully
 *       400:
 *         description: Invalid request
 */
router.add("POST", `/${APP_VERSION}/products`, async (request: BunRequest) => {
  const result = await controller.createProduct(request);
  return result;
});

/**
 * @swagger
 * /v1/products/{id}:
 *   get:
 *     summary: Get product by ID
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
 *         description: Product retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 */
router.add(
  "GET",
  `/${APP_VERSION}/products/:id`,
  async (request: BunRequest) => {
    const result = await controller.getProductById(request);
    return result;
  }
);

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
    return result;
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
    return result;
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
  "PATCH",
  `/${APP_VERSION}/products/:id/inventory`,
  async (request: BunRequest) => {
    return controller.adjustInventory(request);
  }
);

/**
 * @swagger
 * /v1/products/{id}/availability:
 *   get:
 *     summary: Check real-time availability
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
 *         description: Product availability status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 available:
 *                   type: boolean
 *                 inventoryCount:
 *                   type: number
 *                 nextRestockDate:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: Product not found
 */
router.add(
  "GET",
  `/${APP_VERSION}/products/:id/availability`,
  async (request: BunRequest) => {
    return controller.checkAvailability(request);
  }
);

/**
 * @swagger
 * /v1/product-types:
 *   get:
 *     summary: List supported product types
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: List of product types
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
 *                     type: string
 *                     enum: [physical, digital, service]
 */
router.add(
  "GET",
  `/${APP_VERSION}/product-types`,
  async (request: BunRequest) => {
    return controller.getProductTypes(request);
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
