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

export enum TicketStatus {
  ACTIVE = "active",
  USED = "used",
  CANCELLED = "cancelled",
  EXPIRED = "expired",
}

@Entity()
export class Ticket {
  static getRepository(): import("typeorm").Repository<Ticket> | undefined {
    throw new Error("Method not implemented.");
  }
  @PrimaryGeneratedColumn()
  id!: number;

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
  userId!: string;

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

  @CreateDateColumn()
  createdAt!: Date;
}