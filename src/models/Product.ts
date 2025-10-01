import { Entity, Column, ManyToMany, JoinTable, OneToMany } from "typeorm";
import { BaseModel, getDateTimeType, getEnumType, getJsonType } from "./BaseModel";
import { Category } from "./Category";
import type { Category as Categorytype } from "./Category";
import type { ProductVariant } from "../forms/products";

export enum ProductType {
  PHYSICAL = "physical",
  DIGITAL = "digital",
  SUBSCRIPTION = "subscription",
  EVENT = "event",
}

export enum ProductStatus {
  DRAFT = "draft",
  ACTIVE = "active",
  ARCHIVED = "archived",
  DISCONTINUED = "discontinued",
  OUT_OF_STOCK = "out_of_stock",
}

export enum EventType {
  ONLINE = "online",
  OFFLINE = "offline",
  HYBRID = "hybrid",
}

@Entity()
export class Product extends BaseModel {
  @Column({ type: "int", nullable: false })
  businessId!: number;

  @Column({ type: "varchar", length: 255, unique: true })
  sku!: string;

  @Column({ type: "varchar", length: 255 })
  name!: string;

  @Column({ type: "varchar", length: 255, unique: true })
  slug!: string;

  @Column({ type: "text" })
  description!: string;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  price!: number;

  @Column({ type: "varchar", length: 3, default: "USD" })
  currency!: string;

  @Column({ type: "varchar", length: 50, nullable: true })
  taxCode?: string;

  @Column({
    type: getEnumType(),
    enum: ProductType,
    default: ProductType.PHYSICAL,
  })
  type!: ProductType;

  @Column({
    type: getEnumType(),
    enum: ProductStatus,
    default: ProductStatus.ACTIVE,
  })
  status!: ProductStatus;

  @Column({ type: getJsonType(), default: process.env.APP_STATE === "test" ? "[]" : () => "'[]'", })
  variants!: ProductVariant[];

  // Inventory Management
  @Column({ type: "int", nullable: true })
  inventoryCount?: number;

  @Column({ type: "int", nullable: true })
  stockThreshold?: number;

  @Column({ type: "boolean", default: false })
  isBackorderAllowed!: boolean;

  // Digital Product Fields
  @Column({ type: "varchar", length: 255, nullable: true })
  downloadUrl?: string;

  @Column({ type: "int", nullable: true })
  downloadLimit?: number;

  // Physical Product Fields
  @Column({ type: getJsonType(), nullable: true })
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
  weight?: number;

  // Subscription Fields
  @Column({ type: "varchar", length: 50, nullable: true })
  billingInterval?: "monthly" | "yearly";

  @Column({ type: "int", nullable: true })
  trialPeriodDays?: number;

  // Event Product Fields
  @Column({ type: getEnumType(), enum: EventType, nullable: true })
  eventType?: EventType;

  @Column({ type: getDateTimeType(), nullable: true })
  eventStartDate?: Date;

  @Column({ type: getDateTimeType(), nullable: true })
  eventEndDate?: Date;

  @Column({ type: "varchar", length: 255, nullable: true })
  venueName?: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  eventOnlineUrl?: string;

  @Column({ type: getJsonType(), nullable: true })
  eventLocation?: {
    address: string;
    city: string;
    state?: string;
    country: string;
    postalCode?: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };

  @Column({ type: "int", nullable: true })
  eventCapacity?: number;

  @Column({ type: "int", default: 0 })
  eventRegisteredCount!: number;

  @Column({ type: "boolean", default: false })
  eventWaitlistEnabled!: boolean;

  // Relationships
  @ManyToMany(() => Category)
  @JoinTable()
  categories!: Categorytype[];

  // SEO & Visibility
  @Column({ type: "varchar", length: 255, nullable: true })
  metaTitle?: string;

  @Column({ type: "text", nullable: true })
  metaDescription?: string;

  @Column({ type: "boolean", default: true })
  isVisible!: boolean;

  // Media
  @Column({ type: getJsonType(), default: process.env.APP_STATE === "test" ? "[]" : () => "'[]'",})
  images!: Array<{
    url: string;
    altText: string;
    isPrimary: boolean;
  }>;

  // Product Relationships
  @ManyToMany(() => Product)
  @JoinTable()
  relatedProducts!: Product[];
}
