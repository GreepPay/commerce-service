import { TableColumn, type MigrationInterface, type QueryRunner } from "typeorm";

export class AddBusinessIdToSaleTable1742000000004 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      "sale",
      new TableColumn({
        name: "businessId",
        type: "int",
        isNullable: false,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn("sale", "businessId");
  }
}