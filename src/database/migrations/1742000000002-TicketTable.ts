import type { MigrationInterface, QueryRunner } from "typeorm";
import { Table, TableForeignKey } from "typeorm";

export class TicketTable1742000000002 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "ticket",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "productId",
            type: "int",
            isNullable: false,
          },
          {
            name: "variantId",
            type: "varchar",
            length: "50",
            isNullable: true,
          },
          {
            name: "saleId",
            type: "int",
            isNullable: true,
          },
          {
            name: "userId",
            type: "varchar",
            length: "255",
            isNullable: false,
          },
          {
            name: "ticketType",
            type: "varchar",
            length: "50",
            default: "'regular'",
          },
          {
            name: "price",
            type: "decimal",
            precision: 10,
            scale: 2,
            isNullable: false,
          },
          {
            name: "qrCode",
            type: "varchar",
            length: "255",
            isNullable: true,
          },
          {
            name: "status",
            type: "enum",
            enum: ["active", "used", "cancelled", "expired"],
            default: "'active'",
          },
          {
            name: "createdAt",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
          },
        ],
      })
    );

    await queryRunner.createForeignKeys("ticket", [
      new TableForeignKey({
        columnNames: ["productId"],
        referencedTableName: "product",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE",
      }),
      new TableForeignKey({
        columnNames: ["saleId"],
        referencedTableName: "sale",
        referencedColumnNames: ["id"],
        onDelete: "SET NULL",
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable("ticket");
    const foreignKeys = table!.foreignKeys.filter((fk) =>
      ["productId", "saleId"].includes(fk.columnNames[0])
    );
    for (const fk of foreignKeys) {
      await queryRunner.dropForeignKey("ticket", fk);
    }
    await queryRunner.dropTable("ticket");
  }
}
