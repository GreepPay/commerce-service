import { Ticket } from "../models/Ticket";
import { type HttpResponseType, default as HttpResponse } from "../common/HttpResponse";
import { type ICreateTicket } from "../forms/tickets";
import { TicketStatus } from "../models/Ticket";
import type { Sale } from "../models/Sale";
import { In, type EntityManager } from "typeorm";
import { Product, ProductType } from "../models/Product";

export class TicketService {
  async createTicket(ticketData: ICreateTicket): Promise<HttpResponseType> {
    try {
      const ticket = Ticket.create({
        ...ticketData,
        productId: Number(ticketData.productId),
        saleId: ticketData.saleId ? Number(ticketData.saleId) : undefined,
        status: ticketData.status || TicketStatus.ACTIVE
      });

      await ticket.save();

      return HttpResponse.success("Ticket created successfully", ticket, 201);
    } catch (error) {
      console.error("Create Ticket Error:", error);
      return HttpResponse.failure("Failed to create ticket", 400);
    }
  }

    async createFromSale(
    sale: Sale,
    entityManager: EntityManager
  ): Promise<Ticket[]> {
    const productIds = sale.items.map((item) => Number(item.productId));
    const products = await Product.findBy({ id: In(productIds) });

    const productMap = new Map(products.map((p) => [p.id, p]));

    const ticketCreations = sale.items.flatMap((item) => {
      const product = productMap.get(item.productId);
      if (!product || product.type !== ProductType.EVENT) return [];

      const variantLabel = item.name.split(" - ")[1] || "Regular";

      return Array.from({ length: item.quantity }).map(() =>
        entityManager.save(
          entityManager.create(Ticket, {
            productId: Number(item.productId),
            saleId: Number(sale.id),
            userId: sale.customerId,
            variantId: item.variantId || undefined,
            ticketType: variantLabel,
            price: item.unitPrice,
            status: TicketStatus.PENDING,
          })
        )
      );
    });

    return await Promise.all(ticketCreations);
  }

  async updateTicket(
    id: string,
    ticketData: Partial<ICreateTicket>
  ): Promise<HttpResponseType> {
    try {
      const ticket = await Ticket.findOneBy({ id: parseInt(id) });
      if (!ticket) {
        return HttpResponse.notFound("Ticket not found");
      }

      Object.assign(ticket, ticketData);
      await ticket.save();

      return HttpResponse.success("Ticket updated successfully", ticket);
    } catch (error) {
      return HttpResponse.failure("Failed to update ticket", 400);
    }
  }
}