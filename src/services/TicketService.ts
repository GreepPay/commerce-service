import { Ticket } from "../models/Ticket";
import {
  type HttpResponseType,
  default as HttpResponse,
} from "../common/HttpResponse";
import { type ICreateTicket } from "../forms/tickets";
import { TicketStatus } from "../models/Ticket";
import type { Sale } from "../models/Sale";
import { In, type EntityManager } from "typeorm";
import { Product, ProductType } from "../models/Product";

export class TicketService {
  async createTicket(ticketData: ICreateTicket): Promise<Ticket> {
    const ticket = Ticket.create({
      product: { id: Number(ticketData.productId) } as any,
      sale: ticketData.saleId
        ? ({ id: Number(ticketData.saleId) } as any)
        : undefined,
      user: { id: Number(ticketData.userId) } as any,
      variantId: ticketData.variantId,
      ticketType: ticketData.ticketType,
      price: ticketData.price,
      status: ticketData.status || TicketStatus.ACTIVE,
    });

    await ticket.save();
    return ticket;
  }

  async createFromSale(
    sale: Sale,
    entityManager: EntityManager
  ): Promise<Ticket[]> {
    const productIds = sale.items.map((item) => Number(item.productId));
    const products = await Product.findBy({ id: In(productIds) });

    const productMap = new Map(products.map((p) => [p.id, p]));

    const ticketCreations = sale.items.flatMap((item) => {
      const product = productMap.get(Number(item.productId));
      if (!product || product.type !== ProductType.EVENT) return [];

      // Get variant SKU from product.variants based on variantId
      let variantLabel = "Regular";
      if (item.variantId && Array.isArray(product.variants)) {
        const matchedVariant = product.variants.find(
          (v) => v.id === item.variantId
        );
        if (matchedVariant) {
          variantLabel = matchedVariant.sku || "Regular";
        }
      }

      return Array.from({ length: item.quantity }).map(() =>
        entityManager.save(
          entityManager.create(Ticket, {
            productId: Number(item.productId),
            saleId: Number(sale.id),
            userId: sale.customerId,
            variantId: item.variantId || undefined,
            ticketType: variantLabel,
            price: item.unitPrice,
            status: TicketStatus.ACTIVE,
          })
        )
      );
    });

    return await Promise.all(ticketCreations);
  }

  async updateTicket(
    id: string,
    ticketData: Partial<ICreateTicket>
  ): Promise<Ticket> {
    const ticket = await Ticket.findOneBy({ id: parseInt(id) });
    if (!ticket) {
      return HttpResponse.notFound("Ticket not found");
    }

    Object.assign(ticket, ticketData);
    await ticket.save();
    return ticket;
  }
}
