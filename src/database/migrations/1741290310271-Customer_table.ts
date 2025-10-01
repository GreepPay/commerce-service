import "reflect-metadata";
import type { MigrationInterface, QueryRunner } from "typeorm";
import pkg from "typeorm";
const { Table } = pkg;

export class CustomerTable1741290310271 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "customer",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          { name: "firstName", type: "varchar", length: "255", isNullable: false },
          { name: "lastName", type: "varchar", length: "255", isNullable: false },
          { name: "email", type: "varchar", length: "255", isUnique: true, isNullable: false },
          { name: "phoneNumber", type: "varchar", length: "20", isNullable: true },
          { name: "address", type: "varchar", length: "255", isNullable: true },
          { name: "city", type: "varchar", length: "255", isNullable: true },
          { name: "state", type: "varchar", length: "255", isNullable: true },
          { name: "zipCode", type: "varchar", length: "20", isNullable: true },
          { name: "country", type: "varchar", length: "255", isNullable: true },
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
    await queryRunner.dropTable("customer");
  }
}