import type { MigrationInterface, QueryRunner } from "typeorm";
import { TableColumn } from "typeorm";

export class FixNationalCuisineColumnType1702000001000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Drop the old varchar column
    await queryRunner.dropColumn("product", "national_cuisine");

    // Add new boolean column
    await queryRunner.addColumn(
      "product",
      new TableColumn({
        name: "national_cuisine",
        type: "boolean",
        isNullable: true,
        default: false,
        comment: "Whether this product is marked as a national cuisine",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Revert back to varchar
    await queryRunner.dropColumn("product", "national_cuisine");

    await queryRunner.addColumn(
      "product",
      new TableColumn({
        name: "national_cuisine",
        type: "varchar",
        length: "255",
        isNullable: true,
        comment:
          "Type of national cuisine (e.g., Nigerian, South African, etc.)",
      })
    );
  }
}
