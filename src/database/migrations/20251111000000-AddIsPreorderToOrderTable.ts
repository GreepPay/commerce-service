import type { MigrationInterface, QueryRunner } from "typeorm";

export class AddIsPreorderToOrderTable20251111000000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add is_preorder column to orders table with default value false
    await queryRunner.query(`
      ALTER TABLE "commerce_service"."order"
      ADD COLUMN "is_preorder" BOOLEAN NOT NULL DEFAULT false
    `);

  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove the is_preorder column
    await queryRunner.query(`
      ALTER TABLE "commerce_service"."order"
      DROP COLUMN "is_preorder"
    `);
  }
}
