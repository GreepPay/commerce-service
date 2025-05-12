import { type Event } from "./events";

export enum TicketType {
  REGULAR = "regular",
  VIP = "vip",
  VIP_PLUS = "vip+",
}

export interface Ticket {
  id?: number;
  eventId: number;
  event?: Event;
  userId: string;
  ticketType: TicketType;
  price: number;
  qrCode: string;
  createdAt?: Date;
  updatedAt?: Date;
}