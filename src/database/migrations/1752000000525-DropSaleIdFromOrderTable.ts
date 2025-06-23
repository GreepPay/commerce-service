import type { MigrationInterface, QueryRunner } from "typeorm";

export class DropSaleIdFromOrderTable1752000000525 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable("order");
    const foreignKey = table?.foreignKeys.find((fk) =>
      fk.columnNames.includes("saleId")
    );
    if (foreignKey) {
      await queryRunner.dropForeignKey("order", foreignKey);
    }

    await queryRunner.dropColumn("order", "saleId");
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "order" ADD "saleId" integer`
    );
    await queryRunner.query(
      `ALTER TABLE "order" ADD CONSTRAINT "FK_order_sale" FOREIGN KEY ("saleId") REFERENCES "sale"("id") ON DELETE SET NULL ON UPDATE CASCADE`
    );
  }
}