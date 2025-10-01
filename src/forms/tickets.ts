import { TicketStatus } from "../models/Ticket";

export interface Ticket {
  id?: number;
  productId: number;
  variantId?: string;
  saleId?: number;
  userId: number;
  ticketType: string;
  price: number;
  qrCode: string;
  status: TicketStatus;
  createdAt?: Date;
}

export interface ICreateTicket {
  productId: string;
  saleId: string;
  userId: number;
  variantId?: string;
  ticketType: string;
  price: number;
  status?: TicketStatus;
}