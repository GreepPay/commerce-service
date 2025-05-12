import type { MigrationInterface, QueryRunner } from "typeorm";
import { Table, TableForeignKey } from "typeorm";

export class EventTable1742000000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "event",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "userId",
            type: "int",
            isNullable: false,
          },
          {
            name: "categoryId",
            type: "int",
            isNullable: false,
          },
          { name: "title", type: "varchar", length: "255", isNullable: false },
          { name: "description", type: "text", isNullable: true },
          {
            name: "location",
            type: "varchar",
            length: "255",
            isNullable: false,
          },
          { name: "date", type: "date", isNullable: false },
          { name: "startTime", type: "time", isNullable: false },
          { name: "endTime", type: "time", isNullable: false },
          {
            name: "organizer",
            type: "varchar",
            length: "255",
            isNullable: false,
          },
          { name: "price", type: "int", isNullable: false },
          {
            name: "createdAt",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
          },
        ],
      })
    );

    await queryRunner.createForeignKey(
      "event",
      new TableForeignKey({
        columnNames: ["categoryId"],
        referencedTableName: "event_category",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable("event");
    const foreignKey = table?.foreignKeys.find((fk) =>
      fk.columnNames.includes("categoryId")
    );
    if (foreignKey) {
      await queryRunner.dropForeignKey("event", foreignKey);
    }
    await queryRunner.dropTable("event");
  }
}
