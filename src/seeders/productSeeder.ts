import { AppDataSource } from "../data-source";
import { Product, ProductStatus, ProductType, EventType } from "../models/Product";
import { Category } from "../models/Category";
import { faker } from "@faker-js/faker";
import type { ProductVariant } from "../forms/products";

function generateSKU() {
  return `SKU-${faker.string.alphanumeric(8).toUpperCase()}`;
}

function generateSlug(name: string) {
  return faker.helpers.slugify(`${name}-${faker.string.alphanumeric(6)}`).toLowerCase();
}

const randomBusinessId = () => Math.floor(Math.random() * 3) + 1;

const generateImages = (): Array<{ url: string; altText: string; isPrimary: boolean }> => {
  return [
    {
      url: faker.image.urlLoremFlickr({ category: "business" }),
      altText: "Main product image",
      isPrimary: true,
    },
    {
      url: faker.image.urlLoremFlickr({ category: "abstract" }),
      altText: "Alternative product image",
      isPrimary: false,
    },
  ];
};

const createCategories = async () => {
  const repo = AppDataSource.getRepository(Category);
  const categories = [
    repo.create({ name: "Electronics", slug: "electronics" }),
    repo.create({ name: "Software", slug: "software" }),
    repo.create({ name: "Events", slug: "events" }),
    repo.create({ name: "Books", slug: "books" }),
  ];
  await repo.save(categories);
  return categories;
};

const getRandomCategories = (all: Category[]) =>
  faker.helpers.arrayElements(all, { min: 1, max: 2 });

const createPhysicalProduct = (categories: Category[]) => {
  const name = "Physical Product";
  return AppDataSource.getRepository(Product).create({
    businessId: randomBusinessId(),
    sku: generateSKU(),
    name,
    slug: generateSlug(name),
    description: "A tangible product.",
    price: 49.99,
    currency: "USD",
    taxCode: "PHYS-TAX",
    type: ProductType.PHYSICAL,
    status: ProductStatus.ACTIVE,
    inventoryCount: 100,
    stockThreshold: 10,
    isBackorderAllowed: false,
    dimensions: { length: 30, width: 20, height: 10 },
    weight: 1.5,
    variants: [],
    images: generateImages(),
    isVisible: true,
    categories: getRandomCategories(categories),
  });
};

const createDigitalProduct = (categories: Category[]) => {
  const name = "Digital Product";
  return AppDataSource.getRepository(Product).create({
    businessId: randomBusinessId(),
    sku: generateSKU(),
    name,
    slug: generateSlug(name),
    description: "A downloadable product.",
    price: 19.99,
    currency: "USD",
    taxCode: "DIGI-TAX",
    type: ProductType.DIGITAL,
    status: ProductStatus.ACTIVE,
    downloadUrl: "https://example.com/download",
    downloadLimit: 5,
    variants: [],
    images: generateImages(),
    isVisible: true,
    categories: getRandomCategories(categories),
  });
};

const createSubscriptionProduct = (categories: Category[]) => {
  const name = "Subscription Product";
  return AppDataSource.getRepository(Product).create({
    businessId: randomBusinessId(),
    sku: generateSKU(),
    name,
    slug: generateSlug(name),
    description: "A monthly subscription product.",
    price: 9.99,
    currency: "USD",
    taxCode: "SUBS-TAX",
    type: ProductType.SUBSCRIPTION,
    status: ProductStatus.ACTIVE,
    billingInterval: "monthly",
    trialPeriodDays: 14,
    variants: [],
    images: generateImages(),
    isVisible: true,
    categories: getRandomCategories(categories),
  });
};

const createEventProduct = (categories: Category[]) => {
  const name = "Event Product";
  const startDate = faker.date.future();
  const endDate = new Date(startDate.getTime() + 86400000); // +1 day

  const variants: ProductVariant[] = [
    {
      id: faker.string.uuid(),
      sku: `EVT-${faker.string.alphanumeric(6).toUpperCase()}`,
      attributes: { ticket: "Regular" },
      priceAdjustment: 0,
      inventory: 100,
    },
    {
      id: faker.string.uuid(),
      sku: `EVT-${faker.string.alphanumeric(6).toUpperCase()}`,
      attributes: { ticket: "VIP" },
      priceAdjustment: 50,
      inventory: 50,
    },
  ];

  return AppDataSource.getRepository(Product).create({
    businessId: randomBusinessId(),
    sku: generateSKU(),
    name,
    slug: generateSlug(name),
    description: "An event ticket product.",
    price: 99.99,
    currency: "USD",
    taxCode: "EVENT-TAX",
    type: ProductType.EVENT,
    status: ProductStatus.ACTIVE,
    eventType: EventType.HYBRID,
    eventStartDate: startDate,
    eventEndDate: endDate,
    venueName: "Main Hall",
    eventOnlineUrl: "https://example.com/event",
    eventLocation: {
      address: "123 Main St",
      city: "Lagos",
      country: "NG",
    },
    eventCapacity: 200,
    eventRegisteredCount: 0,
    eventWaitlistEnabled: true,
    variants,
    images: generateImages(),
    isVisible: true,
    categories: getRandomCategories(categories),
  });
};

export async function seedProducts() {
  const productRepo = AppDataSource.getRepository(Product);
  const categories = await createCategories();

  const products = [
    ...Array.from({ length: 2 }).map(() => createPhysicalProduct(categories)),
    ...Array.from({ length: 2 }).map(() => createDigitalProduct(categories)),
    ...Array.from({ length: 2 }).map(() => createSubscriptionProduct(categories)),
    ...Array.from({ length: 2 }).map(() => createEventProduct(categories)),
  ];

  await productRepo.save(products);
  console.log("✅ Seeded products with unique slugs, images, and categories.");
}