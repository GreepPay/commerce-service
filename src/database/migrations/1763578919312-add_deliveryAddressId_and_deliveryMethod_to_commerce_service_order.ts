import type { MigrationInterface, QueryRunner } from "typeorm";

export class AddDeliveryAddressIdAndDeliveryMethodToCommerceServiceOrder1763578919312
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE commerce_service.order 
            ADD COLUMN deliveryAddressId INT NULL,
            ADD COLUMN deliveryMethod VARCHAR(255) NULL
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE commerce_service.order 
            DROP COLUMN deliveryAddressId,
            DROP COLUMN deliveryMethod
        `);
  }
}
