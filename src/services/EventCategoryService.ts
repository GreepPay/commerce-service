import { AppDataSource } from "../data-source";
import { EventCategory } from "../models/EventCategory";

export class EventCategoryService {
  private categoryRepo = AppDataSource.getRepository(EventCategory);

  async createCategory(data: Partial<EventCategory>): Promise<EventCategory> {
    const category = this.categoryRepo.create(data);
    return this.categoryRepo.save(category);
  }

  async getCategoryById(id: number): Promise<EventCategory | null> {
    return this.categoryRepo.findOneBy({ id: id.toString() });
  }

  async updateCategory(id: number, data: Partial<EventCategory>): Promise<EventCategory | null> {
    await this.categoryRepo.update(id, data);
    return this.getCategoryById(id);
  }

  async deleteCategory(id: number): Promise<boolean> {
    const result = await this.categoryRepo.delete(id);
    return result.affected !== 0;
  }
}