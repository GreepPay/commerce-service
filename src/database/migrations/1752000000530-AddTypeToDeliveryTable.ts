import {
  TableColumn,
  TableIndex,
  type MigrationInterface,
  type QueryRunner,
} from "typeorm";

export class AddTypeToDeliveryTable1752000000530 implements MigrationInterface {
  name = "AddTypeToDeliveryTable1752000000530";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add the type column
    await queryRunner.addColumn(
      "commerce_service.delivery",
      new TableColumn({
        name: "type",
        type: "varchar",
        length: "10",
        default: "'order'",
        isNullable: false,
      })
    );

    // Update existing records based on business logic
    // If there's an orderId, it's likely an 'order' type
    // If there's no orderId but has pickup/delivery addresses, it's likely 'custom'
    await queryRunner.query(`
            UPDATE "commerce_service"."delivery" 
            SET "type" = CASE 
                WHEN "orderId" IS NOT NULL THEN 'order'
                WHEN "pickupAddress" IS NOT NULL AND "deliveryAddress" IS NOT NULL THEN 'custom'
                ELSE 'order'
            END
        `);

    // Add index for better query performance
    await queryRunner.createIndex(
      "commerce_service.delivery",
      new TableIndex({
        name: "idx_delivery_type",
        columnNames: ["type"],
      })
    );

    // Add composite index for common filtering scenarios
    await queryRunner.createIndex(
      "commerce_service.delivery",
      new TableIndex({
        name: "idx_delivery_type_status",
        columnNames: ["type", "status"],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop indexes first
    await queryRunner.dropIndex(
      "commerce_service.delivery",
      "idx_delivery_type_status"
    );
    await queryRunner.dropIndex(
      "commerce_service.delivery",
      "idx_delivery_type"
    );

    // Drop the type column
    await queryRunner.dropColumn("commerce_service.delivery", "type");
  }
}
