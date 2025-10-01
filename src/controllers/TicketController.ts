import { TicketService } from "../services/TicketService";
import type { BunRequest, Validation } from "../routes/router";
import type { ICreateTicket } from "../forms/tickets";
import HttpResponse from "../common/HttpResponse";

export class TicketController {
  private ticketService = new TicketService();

  async createTicket(request: BunRequest) {
    try {
      const validations: Validation[] = [
        { field: "productId", type: "string", required: true },
        { field: "saleId", type: "string", required: true },
        { field: "userId", type: "string", required: true },
        { field: "variantId", type: "string", required: false },
        { field: "ticketType", type: "string", required: true },
        { field: "price", type: "number", required: true },
        { field: "status", type: "string", required: false }, // optional TicketStatus enum
      ];

      const ticketData = (await request.validate(validations)) as ICreateTicket;

      const result = await this.ticketService.createTicket(ticketData);

      return HttpResponse.success("Ticket created successfully", result, 201);
    } catch (error: any) {
      return HttpResponse.failure(
        error.message || "Failed to create delivery",
        error.status || 500
      );
    }
  }
  
  async updateTicket(request: BunRequest): Promise<Response> {
    const { id } = request.params;
    const updateData = (await request.json()) as Partial<ICreateTicket>;

    const result = await this.ticketService.updateTicket(id, updateData);

    return new Response(JSON.stringify(result.body), {
      headers: { "Content-Type": "application/json" },
      status: result.statusCode,
    });
  }
}
