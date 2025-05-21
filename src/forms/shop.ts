export interface DaySchedule {
  day: string;
  open: boolean;
  openingTime: string | null;
  closingTime: string | null;
}

export interface ICreateShop {
  name: string;
  description?: string;
  coverImageUrl: string;
  schedule: DaySchedule[];
  id: string;
}

export interface IUpdateShop extends Partial<ICreateShop> {}