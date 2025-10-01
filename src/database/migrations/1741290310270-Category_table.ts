import "reflect-metadata";
import type { MigrationInterface, QueryRunner } from "typeorm";
import pkg from "typeorm";
const { Table } = pkg;

export class CategoryTable1741290310270 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "category",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          { name: "name", type: "varchar", length: "255", isNullable: false },
          { name: "slug", type: "varchar", length: "255", isUnique: true, isNullable: false },
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
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("category");
  }
}