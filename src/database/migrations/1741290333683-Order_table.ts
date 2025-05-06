import "reflect-metadata";
import type { MigrationInterface, QueryRunner } from "typeorm";
import pkg from "typeorm";
const { Table, TableForeignKey } = pkg;

export class OrderTable1741290333683 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "order",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            generationStrategy: "uuid",
            default: "uuid_generate_v4()",
          },
          { name: "orderNumber", type: "varchar", length: "255", isNullable: false },
          { name: "items", type: "jsonb", isNullable: false },
          { name: "subtotalAmount", type: "decimal", precision: 10, scale: 2, isNullable: false },
          { name: "taxAmount", type: "decimal", precision: 10, scale: 2, isNullable: false },
          { name: "discountAmount", type: "decimal", precision: 10, scale: 2, isNullable: false },
          { name: "totalAmount", type: "decimal", precision: 10, scale: 2, isNullable: false },
          { name: "currency", type: "varchar", length: "3", default: "'NGN'", isNullable: false },
          {
            name: "status",
            type: "enum",
            enum: ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled", "refunded"],
            default: "'pending'",
          },
          { name: "shippingAddress", type: "varchar", length: "255", isNullable: true },
          { name: "billingAddress", type: "varchar", length: "255", isNullable: true },
          { name: "paymentMethod", type: "varchar", length: "50", isNullable: true },
          {
            name: "paymentStatus",
            type: "enum",
            enum: ["pending", "authorized", "paid", "failed", "refunded", "partially_refunded"],
            default: "'pending'",
          },
          { name: "paymentDetails", type: "jsonb", isNullable: true },
          { name: "appliedDiscounts", type: "jsonb", isNullable: true },
          { name: "taxDetails", type: "jsonb", isNullable: true },
          { name: "refundDetails", type: "jsonb", isNullable: true },
          { name: "statusHistory", type: "jsonb", isNullable: false },
          {
            name: "customerId",
            type: "uuid",
            isNullable: false,
          },
          {
            name: "saleId",
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
      "order",
      new TableForeignKey({
        columnNames: ["customerId"],
        referencedColumnNames: ["id"],
        referencedTableName: "commerce_service.customer",
        onDelete: "CASCADE",
      }),
    );

    await queryRunner.createForeignKey(
      "order",
      new TableForeignKey({
        columnNames: ["saleId"],
        referencedColumnNames: ["id"],
        referencedTableName: "commerce_service.sale",
        onDelete: "CASCADE",
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("order");
  }
}