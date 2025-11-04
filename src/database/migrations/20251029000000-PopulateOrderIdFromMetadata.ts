import type { MigrationInterface, QueryRunner } from "typeorm";

export class PopulateOrderIdFromMetadata20251029000000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Update orderId from metadata.orderId where orderId is null
    await queryRunner.query(`
      UPDATE "commerce_service"."sale"
      SET "orderId" = CAST(metadata->>'orderId' AS INTEGER)
      WHERE "orderId" IS NULL
        AND metadata->>'orderId' IS NOT NULL
    `);

    console.log("✅ Updated orderId from metadata");
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Revert: set orderId to null for all records
    await queryRunner.query(`
      UPDATE "commerce_service"."sale"
      SET "orderId" = NULL
      WHERE metadata->>'orderId' IS NOT NULL
    `);

    console.log("✅ Reverted orderId to null");
  }
}
