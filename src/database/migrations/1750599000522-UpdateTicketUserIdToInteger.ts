import type { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateTicketUserIdToInteger1750599000522
  implements MigrationInterface
{
  name = "UpdateTicketUserIdToInteger1750599000522";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "commerce_service"."ticket"
      ALTER COLUMN "userId" TYPE integer
      USING "userId"::integer
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "commerce_service"."ticket"
      ALTER COLUMN "userId" TYPE character varying(255)
    `);
  }
}
