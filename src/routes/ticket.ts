import { TicketController } from "../controllers/TicketController";
import router, { type BunRequest } from "./router";
const APP_VERSION = "v1";

const ticketController = new TicketController();

/**
 * @swagger
 * /v1/tickets:
 *   post:
 *     summary: Create a new ticket
 *     tags: [Tickets]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - userId
 *               - price
 *               - ticketType
 *             properties:
 *               productId:
 *                 type: number
 *               saleId:
 *                 type: number
 *               userId:
 *                 type: string
 *               variantId:
 *                 type: string
 *               ticketType:
 *                 type: string
 *               price:
 *                 type: number
 *               status:
 *                 type: string
 *                 enum: [active, used, cancelled, expired, pending]
 *     responses:
 *       201:
 *         description: Ticket created successfully
 *       400:
 *         description: Invalid request
 */
router.add("POST", `/${APP_VERSION}/tickets`, async (request: BunRequest) => {
  const result = await ticketController.createTicket(request);
  return new Response(JSON.stringify(result.body), {
    headers: { "Content-Type": "application/json" },
    status: result.statusCode,
  });
});

/**
 * @swagger
 * /v1/tickets/{id}:
 *   patch:
 *     summary: Update ticket by ID
 *     tags: [Tickets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Ticket ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [active, used, cancelled, expired, pending]
 *               ticketType:
 *                 type: string
 *               price:
 *                 type: number
 *     responses:
 *       200:
 *         description: Ticket updated successfully
 *       404:
 *         description: Ticket not found
 */

router.add(
  "PUT",
  `/${APP_VERSION}/tickets/:id`,
  async (request: BunRequest) => {
    const result = await ticketController.updateTicket(request);
    return new Response(JSON.stringify(result.body), {
      headers: { "Content-Type": "application/json" },
      status: result.statusCode,
    });
  }
);
