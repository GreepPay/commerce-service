import {
  TableColumn,
  type MigrationInterface,
  type QueryRunner,
} from "typeorm";

export class MakeOrderIdNullableInDeliveryTable1752000000529
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // First, drop the foreign key constraint
    await queryRunner.query(`
      ALTER TABLE commerce_service.delivery 
      DROP CONSTRAINT IF EXISTS "FK_delivery_orderId"
    `);

    // Change orderId column to be nullable
    await queryRunner.changeColumn(
      "commerce_service.delivery",
      "orderId",
      new TableColumn({
        name: "orderId",
        type: "int",
        isNullable: true,
      })
    );

    // Re-add the foreign key constraint with nullable support
    await queryRunner.query(`
      ALTER TABLE commerce_service.delivery 
      ADD CONSTRAINT "FK_delivery_orderId" 
      FOREIGN KEY ("orderId") 
      REFERENCES "commerce_service"."order"("id") 
      ON DELETE CASCADE
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop the foreign key constraint
    await queryRunner.query(`
      ALTER TABLE commerce_service.delivery 
      DROP CONSTRAINT IF EXISTS "FK_delivery_orderId"
    `);

    // Change orderId column back to not nullable
    await queryRunner.changeColumn(
      "commerce_service.delivery",
      "orderId",
      new TableColumn({
        name: "orderId",
        type: "int",
        isNullable: false,
      })
    );

    // Re-add the foreign key constraint
    await queryRunner.query(`
      ALTER TABLE commerce_service.delivery
      ADD CONSTRAINT "FK_delivery_orderId" 
      FOREIGN KEY ("orderId") 
      REFERENCES "commerce_service"."order"("id") 
      ON DELETE CASCADE
    `);
  }
}
