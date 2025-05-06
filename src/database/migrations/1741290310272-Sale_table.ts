import "reflect-metadata";
import type { MigrationInterface, QueryRunner } from "typeorm";
import pkg from "typeorm";
const { Table, TableForeignKey } = pkg;

export class SaleTable1741290310272 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "sale",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          { name: "transactionId", type: "varchar", length: "255", isNullable: false },
          { name: "customerId", type: "uuid", isNullable: false },
          { name: "subtotalAmount", type: "decimal", precision: 10, scale: 2, isNullable: false },
          { name: "taxAmount", type: "decimal", precision: 10, scale: 2, isNullable: false },
          { name: "discountAmount", type: "decimal", precision: 10, scale: 2, isNullable: false },
          { name: "totalAmount", type: "decimal", precision: 10, scale: 2, isNullable: false },
          { name: "currency", type: "varchar", length: "3", default: "'NGN'", isNullable: false },
          {
            name: "status",
            type: "enum",
            enum: ["pending", "completed", "refunded", "partially_refunded", "cancelled"],
            default: "'pending'",
          },
          { name: "items", type: "jsonb", isNullable: false },
          { name: "appliedDiscounts", type: "jsonb", isNullable: true },
          { name: "taxDetails", type: "jsonb", isNullable: true },
          { name: "paymentDetails", type: "jsonb", isNullable: false },
          { name: "refundDetails", type: "jsonb", isNullable: true },
          { name: "metadata", type: "jsonb", isNullable: true },
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
      "sale",
      new TableForeignKey({
        columnNames: ["customerId"],
        referencedColumnNames: ["id"],
        referencedTableName: "commerce_service.customer",
        onDelete: "CASCADE",
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("sale");
  }
}