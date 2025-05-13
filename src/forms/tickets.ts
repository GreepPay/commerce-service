export type TicketStatus = "active" | "used" | "cancelled" | "expired";

export interface Ticket {
  id?: number;
  productId: number;
  variantId?: string;
  saleId?: number;
  userId: string;
  ticketType: string;
  price: number;
  qrCode: string;
  status?: TicketStatus;
  createdAt?: Date;
}