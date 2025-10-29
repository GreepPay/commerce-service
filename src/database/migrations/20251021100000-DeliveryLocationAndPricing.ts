import "reflect-metadata";
import type { MigrationInterface, QueryRunner } from "typeorm";
import pkg from "typeorm";
const { Table, TableForeignKey } = pkg;

export class DeliveryLocationAndPricing20251021100000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // DeliveryLocation table
    await queryRunner.createTable(
      new Table({
        name: "delivery_location",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "country",
            type: "varchar",
            length: "100",
            isNullable: false,
          },
          { name: "area", type: "varchar", length: "100", isNullable: false },
          {
            name: "status",
            type: "varchar",
            length: "20",
            isNullable: false,
            default: "'active'",
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
      })
    );

    // DeliveryPricing table
    await queryRunner.createTable(
      new Table({
        name: "delivery_pricing",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          { name: "originLocationId", type: "int", isNullable: false },
          { name: "destinationLocationId", type: "int", isNullable: false },
          {
            name: "price",
            type: "decimal",
            precision: 10,
            scale: 2,
            isNullable: false,
          },
          {
            name: "status",
            type: "varchar",
            length: "20",
            isNullable: false,
            default: "'active'",
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
      })
    );

    // Foreign keys
    await queryRunner.createForeignKey(
      "delivery_pricing",
      new TableForeignKey({
        columnNames: ["originLocationId"],
        referencedColumnNames: ["id"],
        referencedTableName: "delivery_location",
        onDelete: "CASCADE",
      })
    );
    await queryRunner.createForeignKey(
      "delivery_pricing",
      new TableForeignKey({
        columnNames: ["destinationLocationId"],
        referencedColumnNames: ["id"],
        referencedTableName: "delivery_location",
        onDelete: "CASCADE",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("delivery_pricing");
    await queryRunner.dropTable("delivery_location");
  }
}
