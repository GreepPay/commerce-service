import { TicketService } from "../services/TicketService";
import HttpResponse from "../common/HttpResponse";
import type { BunRequest } from "../routes/router";
import { TicketStatus } from "../models/Ticket";
import type { EntityManager } from "typeorm";

export class TicketController {
  private ticketService: TicketService;

  constructor() {
    this.ticketService = new TicketService();
  }

   async createTicketsFromSale(request: BunRequest): Promise<Response> {
    try {
      const { saleId } = (await request.json()) as { saleId: number };
      const sale = await Sale.findOneBy({ id: saleId });

      if (!sale) {
        return new Response(
          JSON.stringify(HttpResponse.notFound("Sale not found")),
          { status: 404 }
        );
      }

      const tickets = await AppDataSource.manager.transaction((manager: EntityManager) => {
        return this.ticketService.createFromSale(sale, manager);
      });

      return new Response(
        JSON.stringify(HttpResponse.success("Tickets created", tickets)),
        { status: 201 }
      );
    } catch (error) {
      return new Response(
        JSON.stringify(HttpResponse.failure("Failed to create tickets", 400)),
        { status: 400 }
      );
    }
  }
}
