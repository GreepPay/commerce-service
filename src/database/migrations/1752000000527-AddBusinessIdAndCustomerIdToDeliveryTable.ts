import {
  TableColumn,
  type MigrationInterface,
  type QueryRunner,
} from "typeorm";

export class AddBusinessIdAndCustomerIdToDeliveryTable1752000000527
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      "delivery",
      new TableColumn({
        name: "businessId",
        type: "int",
        isNullable: true,
      })
    );

    await queryRunner.addColumn(
      "delivery",
      new TableColumn({
        name: "customerId",
        type: "int",
        isNullable: true,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn("delivery", "businessId");
    await queryRunner.dropColumn("delivery", "customerId");
  }
}
