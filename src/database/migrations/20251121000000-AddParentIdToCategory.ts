import {
  type MigrationInterface,
  type QueryRunner,
  TableColumn,
  TableForeignKey,
} from "typeorm";

export class AddParentIdToCategory1752000000531 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      "category",
      new TableColumn({
        name: "parentId",
        type: "int",
        isNullable: true,
      })
    );

    await queryRunner.createForeignKey(
      "category",
      new TableForeignKey({
        columnNames: ["parentId"],
        referencedColumnNames: ["id"],
        referencedTableName: "category",
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable("category");
    const foreignKey = table?.foreignKeys.find((fk) =>
      fk.columnNames.includes("parentId")
    );

    if (foreignKey) {
      await queryRunner.dropForeignKey("category", foreignKey);
    }

    await queryRunner.dropColumn("category", "parentId");
  }
}
