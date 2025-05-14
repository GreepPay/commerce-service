import { TicketService } from "../services/TicketService";
import type { BunRequest } from "../routes/router";
import type { ICreateTicket } from "../forms/tickets";

export class TicketController {
  private ticketService = new TicketService();

  async updateTicket(request: BunRequest): Promise<Response> {
    const { id } = request.params;
    const updateData = await request.json() as Partial<ICreateTicket>;

    const result = await this.ticketService.updateTicket(id, updateData);

    return new Response(JSON.stringify(result.body), {
      headers: { "Content-Type": "application/json" },
      status: result.statusCode,
    });
  }
}