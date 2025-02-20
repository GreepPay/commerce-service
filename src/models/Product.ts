import { Entity, Column, ManyToMany, JoinTable } from "typeorm";
import { BaseModel } from "./BaseModel";
import { Category } from "./Category";

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
  @Column({ unique: true })
  sku!: string;

  @Column()
  name!: string;

  @Column({ unique: true })
  slug!: string;

  @Column()
  description!: string;

  @Column("decimal", { precision: 10, scale: 2 })
  price!: number;

  @Column({ default: "USD" })
  currency!: string;

  @Column({ nullable: true })
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
  @Column({ nullable: true })
  inventoryCount?: number;

  @Column({ nullable: true })
  stockThreshold?: number;

  @Column({ default: false })
  isBackorderAllowed!: boolean;

  // Digital Product Fields
  @Column({ nullable: true })
  downloadUrl?: string;

  @Column({ nullable: true })
  downloadLimit?: number;

  // Physical Product Fields
  @Column("jsonb", { nullable: true })
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };

  @Column({ type: "decimal", nullable: true })
  weight?: number;

  // Subscription Fields
  @Column({ nullable: true })
  billingInterval?: "monthly" | "yearly";

  @Column({ nullable: true })
  trialPeriodDays?: number;

  // Relationships
  @ManyToMany(() => Category)
  @JoinTable()
  categories!: Category[];

  // SEO & Visibility
  @Column({ nullable: true })
  metaTitle?: string;

  @Column({ nullable: true })
  metaDescription?: string;

  @Column({ default: true })
  isVisible!: boolean;

  // Media
  @Column("jsonb", { default: [] })
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
