// products.model.ts

// ========================
// Core Product Model
// ========================

export interface BaseProduct {
  id: number;
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
  images?: string[];
  inventoryCount?: number;
  stockThreshold?: number;
  isBackorderAllowed?: boolean;
  national_cuisine?: boolean;
  national_cuisine_country?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateProduct {
  name: string;
  sku: string;
  description: string;
  type: ProductType;
  price: number;
  status: ProductStatus;
  currency: string;
  categoryIds: string[];
  tags: string[];
  inventoryCount?: number;
  stockThreshold?: number;
  isBackorderAllowed?: boolean;
  businessId: number;
  images?: {
    url: string;
    altText: string;
    isPrimary: boolean;
  }[];
  variants?: ProductVariant[];
  physicalDetails?: PhysicalProduct;
  digitalDetails?: DigitalProduct;
  subscriptionDetails?: SubscriptionProduct;
  eventDetails?: EventProduct;
  national_cuisine?: boolean;
  national_cuisine_country?: string;
}

export interface IUpdateProduct extends Partial<ICreateProduct> {
  id: number;
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

export interface EventProduct {
  type: "event";
  eventType: EventType;
  eventDetails: {
    startDate: Date;
    endDate: Date;
    venueName?: string;
    onlineUrl?: string;
    location?: {
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
    capacity?: number;
    registeredCount: number;
    waitlistEnabled: boolean;
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
  images: string;
}

// ========================
// Enums & Types
// ========================

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

export enum EventType {
  ONLINE = "online",
  OFFLINE = "offline",
  HYBRID = "hybrid",
}
