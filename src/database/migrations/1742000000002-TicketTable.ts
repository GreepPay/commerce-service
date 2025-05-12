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
            name: "eventId",
            type: "int",
            isNullable: false,
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
            type: "int",
            isNullable: false,
          },
          {
            name: "qrCode",
            type: "varchar",
            length: "255",
            isNullable: false,
          },
          {
            name: "createdAt",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
          },
        ],
      })
    );

    await queryRunner.createForeignKey(
      "ticket",
      new TableForeignKey({
        columnNames: ["eventId"],
        referencedTableName: "event",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable("ticket");
    const foreignKey = table!.foreignKeys.find(fk => fk.columnNames.includes("eventId"));
    if (foreignKey) {
      await queryRunner.dropForeignKey("ticket", foreignKey);
    }
    await queryRunner.dropTable("ticket");
  }
}