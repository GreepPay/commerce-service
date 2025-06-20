import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from "typeorm";
import { Product } from "./Product";
import { Sale } from "./Sale";
import { BaseModel } from "./BaseModel";

export enum TicketStatus {
  ACTIVE = "active",
  USED = "used",
  CANCELLED = "cancelled",
  EXPIRED = "expired",
  PENDING = "pending",
}

@Entity()
export class Ticket extends BaseModel {
  @Column()
  productId!: number;

  @ManyToOne(() => Product)
  @JoinColumn({ name: "productId" })
  product!: Product;

  @Column({ nullable: true })
  variantId?: string;

  @Column({ nullable: true })
  saleId?: number;

  @ManyToOne(() => Sale)
  @JoinColumn({ name: "saleId" })
  sale!: Sale;

  @Column()
  userId!: number;

  @Column()
  ticketType!: string; // e.g. "VIP"

  @Column("decimal", { precision: 10, scale: 2 })
  price!: number;

  @Column()
  qrCode!: string;

  @Column({
    type: "enum",
    enum: TicketStatus,
    default: TicketStatus.ACTIVE,
  })
  status!: TicketStatus;
}
