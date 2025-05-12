import type { EventCategory } from "./event_categories";

export interface Event {
  id?: number;
  userId: number;
  title: string;
  description?: string;
  location: string;
  date: string;        // Format: YYYY-MM-DD
  startTime: string;   // Format: HH:mm:ss
  endTime: string;     // Format: HH:mm:ss
  organizer: string;
  price: number;
  categoryId: number;
  category?: EventCategory;
  createdAt?: Date;
  updatedAt?: Date;
}