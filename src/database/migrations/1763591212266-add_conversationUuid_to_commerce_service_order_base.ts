import type { MigrationInterface, QueryRunner } from "typeorm";

export class AddConversationUuidToCommerceServiceOrderBase1763591212266
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "commerce_service"."order" 
            ADD COLUMN conversationUuid VARCHAR(255) NULL
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "commerce_service"."order" 
            DROP COLUMN conversationUuid
        `);
  }
}
