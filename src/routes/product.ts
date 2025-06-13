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
