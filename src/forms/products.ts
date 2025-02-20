// products.model.ts

// ========================
// Core Product Model
// ========================

export interface BaseProduct {
  id: string; // UUIDv4
  sku: string;
  name: string;
  description: string;
  type: ProductType;
  status: ProductStatus;
  price: number;
  currency: string; // ISO 4217
  taxCode: string;
  categoryIds: string[];
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateProduct {
  name: string;
  description: string;
  type: ProductType;
  price: number;
  status: ProductStatus;
  currency: string; // ISO 4217
  categoryIds: string[];
  tags: string[];
}

// ========================
// Type-Specific Extensions
// ========================

export interface PhysicalProduct {
  type: "physical";
  weight: number; // kg
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  shippingClass: ShippingClass;
  inventory: {
    stock: number;
    lowStockThreshold: number;
    isBackorderAllowed: boolean;
  };
}

export interface DigitalProduct {
  type: "digital";
  download: {
    url: string;
    accessExpiration?: Date;
    downloadLimit?: number;
  };
  license?: {
    key: string;
    type: LicenseType;
  };
  fileInfo: {
    size: number;
    format: string;
  };
}

export interface SubscriptionProduct {
  type: "subscription";
  billing: {
    interval: BillingInterval;
    trialDays: number;
    gracePeriod: number;
  };
  features: string[];
  renewal: {
    price?: number;
    autoRenew: boolean;
  };
}

// ========================
// Variant Support
// ========================

export interface ProductVariant {
  id: string;
  sku: string;
  attributes: Record<string, string>; // { color: 'red', size: 'xl' }
  priceAdjustment: number;
  inventory?: number; // Overrides parent stock
  images?: string[];
}

// ========================
// Enums & Types
// ========================

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
}

export enum ShippingClass {
  STANDARD = "standard",
  EXPRESS = "express",
  OVERSIZED = "oversized",
}

export enum BillingInterval {
  MONTHLY = "monthly",
  ANNUAL = "annual",
  CUSTOM = "custom",
}

export enum LicenseType {
  SINGLE_USE = "single",
  MULTI_USE = "multi",
  PERPETUAL = "perpetual",
}

// ========================
// Validation Rules
// ========================

/*
  1. SKU must be unique per product type
  2. Physical products require inventory count
  3. Digital products require download URL
  4. Subscription products require billing interval
  5. Price must be ≥ 0
  6. Variant SKUs must be unique within parent product
  */

// ========================
// Relationships
// ========================

/*
  2. Many-to-Many: Product -> Categories
  3. One-to-One: Product -> Inventory
  4. Many-to-Many: Product -> Orders (through OrderItems)
  */

// ========================
// API Integration
// ========================

/*
  GET /products/{id}
  POST /products
    - Body: ProductCreateRequest
  PATCH /products/{id}/inventory
    - Body: { adjustment: number, reason: string }
  GET /products/search?query=...
  */

// ========================
// Database Schema
// ========================

/*
  Table: products
  - id (UUID PK)
  - sku (VARCHAR UNIQUE)
  - type (ENUM)
  - status (ENUM)
  - price (DECIMAL)
  - currency (CHAR(3))
  - metadata (JSONB) - type-specific fields
  - created_at (TIMESTAMP)
  - updated_at (TIMESTAMP)
  
 Table: product_variants
- id (UUID PK)
- product_id (UUID FK)
- sku (VARCHAR)
- attributes (JSONB)
- price_adjustment (DECIMAL)

Table: product_types
- id (SERIAL PK)
- name (VARCHAR)
- schema_def (JSONB) - validation rules
*/

// ========================
// Indexes
// ========================

/*
1. products(sku) - Unique
2. products(type, status) - Composite
3. product_variants(product_id)
4. products(price) - Range queries
*/
