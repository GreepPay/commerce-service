import { ShopController } from "../controllers/ShopController";
import router, { type BunRequest } from "./router";
const APP_VERSION = "v1";

const shopController = new ShopController();

/**
 * @swagger
 * /v1/shops:
 *   post:
 *     summary: Create a new shop
 *     tags: [Shops]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               address:
 *                 type: string
 *               city:
 *                 type: string
 *               state:
 *                 type: string
 *               zip:
 *                 type: string
 *               country:
 *                 type: string
 *     responses:
 *       201:
 *         description: Shop created successfully
 *       400:
 *         description: Invalid request
 */
router.add("POST", `/${APP_VERSION}/shops`, async (request: BunRequest) => {
  const result = await shopController.createShop(request);
  return result;
});

/**
 * @swagger
 * /v1/shops/{id}:
 *   put:
 *     summary: Update shop
 *     tags: [Shops]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Shop ID
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
 *               address:
 *                 type: string
 *               city:
 *                 type: string
 *               state:
 *                 type: string
 *               zip:
 *                 type: string
 *               country:
 *                 type: string
 *     responses:
 *       200:
 *         description: Shop updated successfully
 *       404:
 *         description: Shop not found
 */
router.add(
  "PUT",
  `/${APP_VERSION}/shops/:id`,
  async (request: BunRequest) => {
    const result = await shopController.updateShop(request);
    return result;
  }
);

/**
 * @swagger
 * /v1/shops/{id}:
 *   delete:
 *     summary: Delete shop
 *     tags: [Shops]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Shop ID
 *     responses:
 *       200:
 *         description: Shop deleted successfully
 *       404:
 *         description: Shop not found
 */
router.add(
  "DELETE",
  `/${APP_VERSION}/shops/:id`,
  async (request: BunRequest) => {
    const result = await shopController.deleteShop(request);
    return result;
  }
);