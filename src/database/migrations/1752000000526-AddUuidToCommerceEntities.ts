import type { MigrationInterface, QueryRunner } from "typeorm";

export class AddUuidToCommerceEntities1752000000526 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const tables = [
      "category",
      "delivery",
      "order",
      "product",
      "sale",
      "ticket",
    ];

    for (const table of tables) {
      await queryRunner.query(
        `ALTER TABLE commerce_service.${table} ADD COLUMN uuid uuid`
      );
      await queryRunner.query(
        `UPDATE commerce_service.${table} SET uuid = uuid_generate_v4()`
      );
      await queryRunner.query(
        `ALTER TABLE commerce_service.${table} ALTER COLUMN uuid SET DEFAULT uuid_generate_v4()`
      );
      await queryRunner.query(
        `ALTER TABLE commerce_service.${table} ALTER COLUMN uuid SET NOT NULL`
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const tables = [
      "category",
      "delivery",
      "order",
      "product",
      "sale",
      "ticket",
    ];

    for (const table of tables) {
      await queryRunner.query(
        `ALTER TABLE commerce_service.${table} DROP COLUMN uuid`
      );
    }
  }
}