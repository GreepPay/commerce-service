import "reflect-metadata";
import type { MigrationInterface, QueryRunner } from "typeorm";
import pkg from "typeorm";
const { Table, TableForeignKey } = pkg;

export class DeliveryTable1741290333683 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "delivery",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            generationStrategy: "uuid",
            default: "uuid_generate_v4()",
          },
          { name: "trackingNumber", type: "varchar", length: "255", isNullable: false },
          { name: "status", type: "varchar", length: "50", isNullable: false },
          { name: "estimatedDeliveryDate", type: "timestamp", isNullable: false },
          { name: "actualDeliveryDate", type: "timestamp", isNullable: true },
          { name: "deliveryAddress", type: "varchar", length: "255", isNullable: false },
          { name: "metadata", type: "jsonb", isNullable: true },
          { name: "trackingUpdates", type: "jsonb", isNullable: true },
          { name: "deliveryAttempts", type: "jsonb", isNullable: true },
          {
            name: "orderId",
            type: "uuid",
            isNullable: false,
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
    );

    await queryRunner.createForeignKey(
      "delivery",
      new TableForeignKey({
        columnNames: ["orderId"],
        referencedColumnNames: ["id"],
        referencedTableName: "order",
        onDelete: "CASCADE",
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("delivery");
  }
}