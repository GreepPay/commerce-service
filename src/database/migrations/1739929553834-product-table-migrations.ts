import type { MigrationInterface, QueryRunner } from "typeorm";
import pkg from "typeorm";
const { Table } = pkg;

export class ProductTableMigrations1739929553834 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "product",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            generationStrategy: "uuid",
          },
          { name: "sku", type: "varchar", isUnique: true },
          { name: "name", type: "varchar" },
          { name: "description", type: "text" },
          { name: "status", type: "varchar", default: "'draft'" },
          { name: "price", type: "decimal", precision: 10, scale: 2 },
          { name: "currency", type: "varchar", length: "3" },
          { name: "taxCode", type: "varchar" },
          { name: "inventoryCount", type: "int", isNullable: true },
          { name: "stockThreshold", type: "int", isNullable: true },
          { name: "isBackorderAllowed", type: "boolean", default: false },
          { name: "availabilityDate", type: "timestamp", isNullable: true },
          { name: "slug", type: "varchar", isUnique: true },
          { name: "metaTitle", type: "varchar", isNullable: true },
          { name: "metaDescription", type: "text", isNullable: true },
          { name: "isVisible", type: "boolean", default: true },
          { name: "tags", type: "text", isArray: true },
        ],
      }),
      true
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("products");
  }
}
