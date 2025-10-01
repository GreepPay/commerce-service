import { type MigrationInterface, type QueryRunner, TableColumn, TableForeignKey } from "typeorm";

export class AddOrderIdToSaleTable1752000000524 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add the orderId column
    await queryRunner.addColumn("sale", new TableColumn({
      name: "orderId",
      type: "int",
      isNullable: true,
    }));

    // Add foreign key constraint
    await queryRunner.createForeignKey("sale", new TableForeignKey({
      columnNames: ["orderId"],
      referencedTableName: "order",
      referencedColumnNames: ["id"],
      onDelete: "SET NULL", // Optional: safely nullify on order deletion
      onUpdate: "CASCADE",
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign key first
    const table = await queryRunner.getTable("sale");
    const foreignKey = table?.foreignKeys.find(
      fk => fk.columnNames.includes("orderId")
    );
    if (foreignKey) {
      await queryRunner.dropForeignKey("sale", foreignKey);
    }

    // Drop the column
    await queryRunner.dropColumn("sale", "orderId");
  }
}