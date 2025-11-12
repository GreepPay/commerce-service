import type { MigrationInterface, QueryRunner } from "typeorm";
import { TableColumn } from "typeorm";

export class AddTagsAndCuisineToProducts1702000000000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      "product",
      new TableColumn({
        name: "tags",
        type: "json",
        isNullable: true,
        default: "'[]'",
        comment: "Array of product tags for categorization and filtering",
      })
    );

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

    await queryRunner.addColumn(
      "product",
      new TableColumn({
        name: "national_cuisine_country",
        type: "varchar",
        length: "255",
        isNullable: true,
        comment: "Country of origin for the national cuisine",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn("product", "national_cuisine_country");
    await queryRunner.dropColumn("product", "national_cuisine");
    await queryRunner.dropColumn("product", "tags");
  }
}
