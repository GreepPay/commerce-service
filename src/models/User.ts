import { Entity, Column } from 'typeorm';
import { BaseModel } from './BaseModel';

@Entity()
export class User extends BaseModel {
  @Column({ type: "varchar" }) 
  name!: string;

  @Column({ type: "varchar" })
  email!: string;
}