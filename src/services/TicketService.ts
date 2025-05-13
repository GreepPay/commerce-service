import { In, EntityManager } from "typeorm";
import { Ticket as TicketEntity, TicketStatus } from "../models/Ticket";
import { Product } from "../models/Product";
import { Sale } from "../models/Sale";
import type { Ticket } from "../forms/tickets";

export class TicketService {
  async createFromSale(
    sale: Sale,
    entityManager: EntityManager
  ): Promise<Ticket[]> {
    const tickets: Ticket[] = [];
    const productIds = sale.items.map((item) => item.productId);

    const products = await Product.findBy({ id: In(productIds) });

    for (const item of sale.items) {
      const product = products.find((p) => p.id === item.productId);
      if (!product || product.type !== "event") continue;

      const variantLabel = item.name.split(" - ")[1] || "Regular";

      for (let i = 0; i < item.quantity; i++) {
        const saved = await entityManager.save(
          entityManager.create(TicketEntity, {
            productId: parseInt(product.id),
            variantId: item.variantId || undefined,
            saleId: parseInt(sale.id),
            userId: sale.customerId,
            ticketType: variantLabel,
            price: item.unitPrice,
            status: TicketStatus.ACTIVE,
          })
        );

        tickets.push(saved);
      }
    }

    return tickets;
  }
}
