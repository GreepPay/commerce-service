import type { MigrationInterface, QueryRunner } from "typeorm";
import pkg from "typeorm";
const { Table } = pkg;

export class NewProductMigration1739947705566 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "product",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          { name: "sku", type: "varchar", length: "255", isUnique: true },
          { name: "name", type: "varchar", length: "255" },
          { name: "slug", type: "varchar", length: "255", isUnique: true },
          { name: "description", type: "text" },
          { name: "price", type: "decimal", precision: 10, scale: 2 },
          { name: "currency", type: "varchar", length: "3", default: "'USD'" },
          { name: "taxCode", type: "varchar", length: "50", isNullable: true },
          {
            name: "type",
            type: "enum",
            enum: ["physical", "digital", "subscription", "event"],
            default: "'physical'",
          },
          {
            name: "status",
            type: "enum",
            enum: [
              "draft",
              "active",
              "archived",
              "discontinued",
              "out_of_stock",
            ],
            default: "'active'",
          },

          // Physical Fields
          { name: "dimensions", type: "jsonb", isNullable: true },
          {
            name: "weight",
            type: "decimal",
            precision: 10,
            scale: 2,
            isNullable: true,
          },
          { name: "inventoryCount", type: "int", isNullable: true },
          { name: "stockThreshold", type: "int", isNullable: true },
          { name: "isBackorderAllowed", type: "boolean", default: false },

          // Digital Fields
          {
            name: "downloadUrl",
            type: "varchar",
            length: "255",
            isNullable: true,
          },
          { name: "downloadLimit", type: "int", isNullable: true },
          { name: "license", type: "jsonb", isNullable: true }, // { key, type }
          { name: "fileInfo", type: "jsonb", isNullable: true }, // { size, format }

          // Subscription Fields
          {
            name: "billingInterval",
            type: "varchar",
            length: "50",
            isNullable: true,
          },
          { name: "trialPeriodDays", type: "int", isNullable: true },
          { name: "gracePeriod", type: "int", isNullable: true },
          { name: "renewal", type: "jsonb", isNullable: true }, // { price, autoRenew }
          { name: "features", type: "jsonb", isNullable: true },

          // Event Fields
          {
            name: "eventType",
            type: "enum",
            enum: ["online", "offline", "hybrid"],
            isNullable: true,
          },
          { name: "eventStartDate", type: "timestamp", isNullable: true },
          { name: "eventEndDate", type: "timestamp", isNullable: true },
          {
            name: "venueName",
            type: "varchar",
            length: "255",
            isNullable: true,
          },
          {
            name: "eventOnlineUrl",
            type: "varchar",
            length: "255",
            isNullable: true,
          },
          { name: "eventLocation", type: "jsonb", isNullable: true },
          { name: "eventCapacity", type: "int", isNullable: true },
          { name: "eventRegisteredCount", type: "int", default: 0 },
          { name: "eventWaitlistEnabled", type: "boolean", default: false },

          // Common
          {
            name: "metaTitle",
            type: "varchar",
            length: "255",
            isNullable: true,
          },
          { name: "metaDescription", type: "text", isNullable: true },
          { name: "isVisible", type: "boolean", default: true },
          { name: "images", type: "jsonb", default: "'[]'" },
          {
            name: "variants",
            type: "jsonb",
            default: "'[]'",
          },
          {
            name: "createdAt",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
          },
          {
            name: "updatedAt",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
            onUpdate: "CURRENT_TIMESTAMP",
          },
        ],
      }),
      true
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("product");
  }
}
