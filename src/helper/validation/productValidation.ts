import {
  BillingInterval,
  EventType,
  LicenseType,
  ProductStatus,
  ProductType,
  ShippingClass,
} from "../../forms/products";
import type { Validation } from "../../routes/router";

export const baseProductFields: Validation[] = [
  { field: "name", type: "string", required: true },
  { field: "sku", type: "string", required: true },
  { field: "description", type: "string", required: true },
  {
    field: "type",
    type: "string",
    required: true,
    allowed: Object.values(ProductType),
  },
  { field: "price", type: "number", required: true },
  {
    field: "status",
    type: "string",
    required: false,
    allowed: Object.values(ProductStatus),
  },
  { field: "currency", type: "string", required: true },
  {
    field: "categoryIds",
    type: "array",
    required: false,
    children: [{ field: "", type: "string" }],
  },
  {
    field: "tags",
    type: "array",
    required: false,
    children: [{ field: "", type: "string" }],
  },
  {
    field: "images",
    type: "array",
    required: false,
    children: [
      {
        field: "",
        type: "object",
        required: false,
        children: [
          { field: "url", type: "string", required: true },
          { field: "altText", type: "string", required: false },
          { field: "isPrimary", type: "boolean", required: false },
        ],
      },
    ],
  },
  { field: "businessId", type: "number", required: true },
  { field: "inventoryCount", type: "number", required: false },
  { field: "stockThreshold", type: "number", required: false },
  { field: "isBackorderAllowed", type: "boolean", required: false },
];

export const optionalTypeFields: Validation[] = [
  // Variants
  {
    field: "variants",
    type: "array",
    required: false,
    children: [
      {
        field: "",
        type: "object",
        required: false,
        children: [
          { field: "id", type: "string", required: true },
          { field: "sku", type: "string", required: true },
          {
            field: "attributes",
            type: "object",
            required: false,
          },
          { field: "priceAdjustment", type: "number", required: false },
          { field: "inventory", type: "number", required: false },
          { field: "images", type: "string", required: false },
        ],
      },
    ],
  },

  // Physical
  { field: "weight", type: "number", required: false },
  {
    field: "dimensions",
    type: "object",
    required: false,
    children: [
      { field: "length", type: "number", required: false },
      { field: "width", type: "number", required: false },
      { field: "height", type: "number", required: false },
    ],
  },
  {
    field: "shippingClass",
    type: "string",
    required: false,
    allowed: Object.values(ShippingClass),
  },
  {
    field: "inventory",
    type: "object",
    required: false,
    children: [
      { field: "stock", type: "number", required: false },
      { field: "lowStockThreshold", type: "number", required: false },
      { field: "isBackorderAllowed", type: "boolean", required: false },
    ],
  },

  // Digital
  {
    field: "download",
    type: "object",
    required: false,
    children: [
      { field: "url", type: "string", required: false },
      { field: "accessExpiration", type: "string", required: false },
      { field: "downloadLimit", type: "number", required: false },
    ],
  },
  {
    field: "license",
    type: "object",
    required: false,
    children: [
      { field: "key", type: "string", required: false },
      {
        field: "type",
        type: "string",
        required: false,
        allowed: Object.values(LicenseType),
      },
    ],
  },
  {
    field: "fileInfo",
    type: "object",
    required: false,
    children: [
      { field: "size", type: "number", required: false },
      { field: "format", type: "string", required: false },
    ],
  },

  // Subscription
  {
    field: "billing",
    type: "object",
    required: false,
    children: [
      {
        field: "interval",
        type: "string",
        required: false,
        allowed: Object.values(BillingInterval),
      },
      { field: "trialDays", type: "number", required: false },
      { field: "gracePeriod", type: "number", required: false },
    ],
  },
  {
    field: "features",
    type: "array",
    required: false,
    children: [{ field: "", type: "string" }],
  },
  {
    field: "renewal",
    type: "object",
    required: false,
    children: [
      { field: "price", type: "number", required: false },
      { field: "autoRenew", type: "boolean", required: false },
    ],
  },

  // Event
  {
    field: "eventType",
    type: "string",
    required: false,
    allowed: Object.values(EventType),
  },
  {
    field: "eventDetails",
    type: "object",
    required: false,
    children: [
      { field: "startDate", type: "string", required: false },
      { field: "endDate", type: "string", required: false },
      { field: "venueName", type: "string", required: false },
      { field: "onlineUrl", type: "string", required: false },
      {
        field: "location",
        type: "object",
        required: false,
        children: [
          { field: "address", type: "string", required: false },
          { field: "city", type: "string", required: false },
          { field: "state", type: "string", required: false },
          { field: "country", type: "string", required: false },
          { field: "postalCode", type: "string", required: false },
          {
            field: "coordinates",
            type: "object",
            required: false,
            children: [
              { field: "lat", type: "number", required: false },
              { field: "lng", type: "number", required: false },
            ],
          },
        ],
      },
      { field: "capacity", type: "number", required: false },
      { field: "registeredCount", type: "number", required: false },
      { field: "waitlistEnabled", type: "boolean", required: false },
    ],
  },
];

export const fullProductValidationSchema: Validation[] = [
  ...baseProductFields,
  ...optionalTypeFields,
];