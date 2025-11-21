import "reflect-metadata";
import type { MigrationInterface, QueryRunner } from "typeorm";

export class SeedCategories1752000000532 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const categories = [
      {
        name: "Tubers",
        slug: "tubers",
        parentId: null,
        subcategories: ["Yam", "Cassava", "Potatoes"],
      },
      {
        name: "Grains & Cereals",
        slug: "grains-cereals",
        parentId: null,
        subcategories: ["Rice", "Maize", "Millet"],
      },
      {
        name: "Legumes & Nuts",
        slug: "legumes-nuts",
        parentId: null,
        subcategories: ["Beans", "Peas", "Groundnuts"],
      },
      {
        name: "Dried Foods & Veggies",
        slug: "dried-foods-veggies",
        parentId: null,
        subcategories: [],
      },
      {
        name: "Fresh Produce",
        slug: "fresh-produce",
        parentId: null,
        subcategories: ["Fruits", "Vegetables"],
      },
      {
        name: "Meat & Poultry",
        slug: "meat-poultry",
        parentId: null,
        subcategories: [],
      },
      {
        name: "Fish & Seafood",
        slug: "fish-seafood",
        parentId: null,
        subcategories: [],
      },
      {
        name: "Oil & Fat",
        slug: "oil-fat",
        parentId: null,
        subcategories: ["Palm Oil", "Groundnut Oil", "Butter"],
      },
      {
        name: "Spices & Seasonings",
        slug: "spices-seasonings",
        parentId: null,
        subcategories: [],
      },
      {
        name: "Bakery & Pastries",
        slug: "bakery-pastries",
        parentId: null,
        subcategories: ["Bread", "Cakes", "Snacks"],
      },
      {
        name: "Drinks & Beverages",
        slug: "drinks-beverages",
        parentId: null,
        subcategories: ["Juices", "Smoothies", "Water"],
      },
      {
        name: "Condiments & Sauces",
        slug: "condiments-sauces",
        parentId: null,
        subcategories: ["Stew Base", "Marinades"],
      },
      {
        name: "Soaps & Body Wash",
        slug: "soaps-body-wash",
        parentId: null,
        subcategories: [],
      },
      {
        name: "Creams & Lotions",
        slug: "creams-lotions",
        parentId: null,
        subcategories: [],
      },
      {
        name: "Hair Care Products",
        slug: "hair-care-products",
        parentId: null,
        subcategories: ["Shampoos", "Oils", "Conditioners"],
      },
      {
        name: "Skincare & Cosmetics",
        slug: "skincare-cosmetics",
        parentId: null,
        subcategories: ["Makeup", "Serums", "Balms"],
      },
      {
        name: "Perfumes & Fragrances",
        slug: "perfumes-fragrances",
        parentId: null,
        subcategories: [],
      },
      {
        name: "Custom & Handmade Products",
        slug: "custom-handmade-products",
        parentId: null,
        subcategories: ["Crafts", "Gifts", "Decor"],
      },
      {
        name: "Cleaning & Household Items",
        slug: "cleaning-household-items",
        parentId: null,
        subcategories: [],
      },
      {
        name: "Toiletries & Essentials",
        slug: "toiletries-essentials",
        parentId: null,
        subcategories: [],
      },
      {
        name: "Salon & Spa Services",
        slug: "salon-spa-services",
        parentId: null,
        subcategories: [],
      },
      {
        name: "Event & Creative Services",
        slug: "event-creative-services",
        parentId: null,
        subcategories: ["Photography", "Decor"],
      },
      {
        name: "Farm Produce & Supplies",
        slug: "farm-produce-supplies",
        parentId: null,
        subcategories: [],
      },
      {
        name: "Raw Materials & Compounds",
        slug: "raw-materials-compounds",
        parentId: null,
        subcategories: ["Lye", "Waxes", "Oils", "Bases"],
      },
    ];

    // Insert main categories and get their IDs
    for (const category of categories) {
      const result = await queryRunner.query(
        `INSERT INTO "commerce_service"."category" (name, slug, "parentId", "createdAt", "updatedAt") 
         VALUES ($1, $2, $3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
         RETURNING id`,
        [category.name, category.slug, category.parentId]
      );

      const parentId = result[0].id;

      // Insert subcategories
      if (category.subcategories.length > 0) {
        for (const subName of category.subcategories) {
          const subSlug =
            subName
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/(^-|-$)/g, "") +
            "-" +
            Math.random().toString(36).substring(2, 9);

          await queryRunner.query(
            `INSERT INTO "commerce_service"."category" (name, slug, "parentId", "createdAt", "updatedAt") 
             VALUES ($1, $2, $3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
            [subName, subSlug, parentId]
          );
        }
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Delete all categories (both main and sub)
    await queryRunner.query(`DELETE FROM "commerce_service"."category"`);
  }
}
