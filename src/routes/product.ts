import { ProductController } from "../controllers/ProductController";
import router, { type BunRequest } from "./router";
const APP_VERSION = "v1";

/**
 * @swagger
 * /v1/products:
 *   get:
 *     summary: Gets all products
 *     tags: [Authorization]
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the role
 *     responses:
 *       201:
 *         description: Role created successfully
 *       400:
 *         description: Invalid request
 */
router.add("GET", `/${APP_VERSION}/products`, async (request: BunRequest) => {
  const result = await new ProductController().getAllProducts(request);
  return new Response(JSON.stringify(result.body), {
    headers: { "Content-Type": "application/json" },
    status: result.statusCode,
  });
});

// /**
//  * @swagger
//  * /v1/auth/permissions:
//  *   post:
//  *     summary: Update permissions for a role
//  *     tags: [Authorization]
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               role_id:
//  *                 type: string
//  *               permission_name:
//  *                 type: string
//  *     responses:
//  *       200:
//  *         description: Permissions updated successfully
//  *       400:
//  *         description: Invalid request
//  *       404:
//  *         description: Role not found
//  */
// router.add('POST', `/${APP_VERSION}/auth/permissions`, async (request: BunRequest) => {
//     const result = await new AuthorizationController().updatePermissionInRole(request);
//     return new Response(JSON.stringify(result.body), {
//         headers: { 'Content-Type': 'application/json' },
//         status: result.statusCode
//     });
// });

// /**
//  * @swagger
//  * /v1/auth/user-can/{permission_name}:
//  *   get:
//  *     summary: Check if user has specific permission
//  *     tags: [Authorization]
//  *     parameters:
//  *       - in: path
//  *         name: permission_name
//  *         required: true
//  *         schema:
//  *           type: string
//  *         description: Name of the permission to check
//  *     responses:
//  *       200:
//  *         description: Returns whether user has the permission
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 can:
//  *                   type: boolean
//  *       400:
//  *         description: Invalid request
//  *       401:
//  *         description: Unauthorized
//  */
// router.add('GET', `/${APP_VERSION}/auth/user-can/:permission_name`, async (request: BunRequest) => {
//     const result = await new AuthorizationController().userCan(request);
//     return new Response(JSON.stringify(result.body), {
//         headers: { 'Content-Type': 'application/json' },
//         status: result.statusCode
//     });
// });
