import { TicketStatus } from "../models/Ticket";

export interface Ticket {
  id?: number;
  productId: number;
  variantId?: string;
  saleId?: number;
  userId: string;
  ticketType: string;
  price: number;
  qrCode: string;
  status: TicketStatus;
  createdAt?: Date;
}

export interface ICreateTicket {
  productId: string;
  saleId: string;
  userId: string;
  variantId?: string;
  ticketType: string;
  price: number;
  status?: TicketStatus;
}