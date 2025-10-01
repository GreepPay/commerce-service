import { TableColumn, type MigrationInterface, type QueryRunner } from "typeorm";

export class AddUpdatedAtToTicketTable1742000000003 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      "ticket",
      new TableColumn({
        name: "updatedAt",
        type: "timestamp",
        isNullable: false,
        default: "CURRENT_TIMESTAMP",
        onUpdate: "CURRENT_TIMESTAMP",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn("ticket", "updatedAt");
  }
}