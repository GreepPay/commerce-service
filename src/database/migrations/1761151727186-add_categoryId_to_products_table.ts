import type { MigrationInterface, QueryRunner } from "typeorm";

export class AddCategoryIdToProductsTable1761151727186
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "commerce_service"."product" ADD COLUMN "categoryId" integer`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "commerce_service"."product" DROP COLUMN "categoryId"`
    );
  }
}
