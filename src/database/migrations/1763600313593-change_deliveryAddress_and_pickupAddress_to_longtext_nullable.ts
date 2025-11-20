import type { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeDeliveryAddressAndPickupAddressToLongtextNullable1763600313593
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "commerce_service"."delivery" 
            ALTER COLUMN "deliveryAddress" TYPE TEXT,
            ALTER COLUMN "deliveryAddress" DROP NOT NULL
        `);

    await queryRunner.query(`
            ALTER TABLE "commerce_service"."delivery" 
            ALTER COLUMN "pickupAddress" TYPE TEXT,
            ALTER COLUMN "pickupAddress" DROP NOT NULL
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "commerce_service"."delivery" 
            ALTER COLUMN "deliveryAddress" SET NOT NULL
        `);

    await queryRunner.query(`
            ALTER TABLE "commerce_service"."delivery" 
            ALTER COLUMN "pickupAddress" SET NOT NULL
        `);
  }
}
