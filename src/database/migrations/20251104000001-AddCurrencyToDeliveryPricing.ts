import type { MigrationInterface, QueryRunner } from "typeorm";

export class AddCurrencyToDeliveryPricing20251104000001
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add currency column with default value 'TRY'
    await queryRunner.query(`
      ALTER TABLE "commerce_service"."delivery_pricing"
      ADD COLUMN "currency" VARCHAR(3) NOT NULL DEFAULT 'TRY'
    `);

    // Update existing records to have TRY currency
    await queryRunner.query(`
      UPDATE "commerce_service"."delivery_pricing"
      SET "currency" = 'TRY'
      WHERE "currency" IS NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove the currency column
    await queryRunner.query(`
      ALTER TABLE "commerce_service"."delivery_pricing"
      DROP COLUMN "currency"
    `);
  }
}
