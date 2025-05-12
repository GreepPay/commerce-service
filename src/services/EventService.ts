import { AppDataSource } from "../data-source";
import { Event } from "../models/Event";
import { EventCategory } from "../models/EventCategory";

export class EventService {
  private eventRepo = AppDataSource.getRepository(Event);

  async createEvent(data: Partial<Event>): Promise<Event> {
    const event = this.eventRepo.create(data);
    return this.eventRepo.save(event);
  }


  async getEventById(id: number): Promise<Event | null> {
    return this.eventRepo.findOne({
      where: { id: id.toString() },
      relations: ["category"],
    });
  }

  async updateEvent(id: number, data: Partial<Event>): Promise<Event | null> {
    await this.eventRepo.update(id, data);
    return this.getEventById(id);
  }

  async deleteEvent(id: number): Promise<boolean> {
    const result = await this.eventRepo.delete(id);
    return result.affected !== 0;
  }
}