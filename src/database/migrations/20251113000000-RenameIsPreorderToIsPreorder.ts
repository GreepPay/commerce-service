import type { MigrationInterface, QueryRunner } from "typeorm";

export class RenameIsPreorderToIsPreorder20251113000000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Rename is_preorder column to isPreorder
    await queryRunner.query(`
      ALTER TABLE "commerce_service"."order"
      RENAME COLUMN "is_preorder" TO "isPreorder"
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Rename isPreorder column back to is_preorder
    await queryRunner.query(`
      ALTER TABLE "commerce_service"."order"
      RENAME COLUMN "isPreorder" TO "is_preorder"
    `);
  }
}
