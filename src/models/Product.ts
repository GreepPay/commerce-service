import { Entity, Column, ManyToMany, JoinTable } from "typeorm";
import { BaseModel } from "./BaseModel";
import { Category } from "./Category";
import type { Category as Categorytype} from "./Category";

export enum ProductType {
  PHYSICAL = "physical",
  DIGITAL = "digital",
  SUBSCRIPTION = "subscription",
}

export enum ProductStatus {
  DRAFT = "draft",
  ACTIVE = "active",
  ARCHIVED = "archived",
  DISCONTINUED = "discontinued",
  OUT_OF_STOCK = "out_of_stock",
}

@Entity()
export class Product extends BaseModel {
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
    type: "enum",
    enum: ProductType,
    default: ProductType.PHYSICAL,
  })
  type!: ProductType;

  @Column({
    type: "enum",
    enum: ProductStatus,
    default: ProductStatus.ACTIVE,
  })
  status!: ProductStatus;

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
  @Column({ type: "jsonb", nullable: true })
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
  @Column({ type: "jsonb", default: [] })
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