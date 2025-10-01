import {
  TableColumn,
  type MigrationInterface,
  type QueryRunner,
} from "typeorm";

export class AddMissingFieldsToDeliveryTable1752000000528
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add pickupAddress column
    await queryRunner.addColumn(
      "delivery",
      new TableColumn({
        name: "pickupAddress",
        type: "varchar",
        length: "255",
        isNullable: true,
      })
    );

    // Add urgency column
    await queryRunner.addColumn(
      "delivery",
      new TableColumn({
        name: "urgency",
        type: "varchar",
        length: "20",
        isNullable: true,
      })
    );

    // Add price column
    await queryRunner.addColumn(
      "delivery",
      new TableColumn({
        name: "price",
        type: "decimal",
        precision: 10,
        scale: 2,
        isNullable: true,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn("delivery", "pickupAddress");
    await queryRunner.dropColumn("delivery", "urgency");
    await queryRunner.dropColumn("delivery", "price");
  }
}
