import type { MigrationInterface, QueryRunner } from "typeorm";

export class SeedDeliveryLocationsAndPricing20251021120000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Insert delivery locations
    await queryRunner.query(`
      INSERT INTO "commerce_service"."delivery_location" ("country", "area", "status") VALUES
      ('Cyprus', 'Lefkosia Center', 'active'),
      ('Cyprus', 'Mesa Geitonia', 'active'),
      ('Cyprus', 'Limassol Center', 'active'),
      ('Cyprus', 'Larnaca Center', 'active'),
      ('Cyprus', 'Paphos Center', 'active'),
      ('Cyprus', 'Ayia Napa', 'active'),
      ('Cyprus', 'Strovolos', 'active'),
      ('Cyprus', 'Engomi', 'active'),
      ('Cyprus', 'Aglandjia', 'active'),
      ('Cyprus', 'Kaimakli', 'active'),
      ('Cyprus', 'Germasogeia', 'active'),
      ('Cyprus', 'Aradippou', 'active'),
      ('Cyprus', 'Dali', 'active'),
      ('Cyprus', 'Paralimni', 'active'),
      ('Cyprus', 'Polis Chrysochous', 'active'),
      ('Cyprus', 'Protaras', 'active'),
      ('Cyprus', 'Lakatamia', 'active'),
      ('Cyprus', 'Latsia', 'active'),
      ('Cyprus', 'Oroklini', 'active'),
      ('Cyprus', 'Pera Chorio', 'active')
    `);

    // Insert delivery pricing using raw SQL and subqueries for location IDs
    await queryRunner.query(`
      INSERT INTO "commerce_service"."delivery_pricing" ("originLocationId", "destinationLocationId", "price", "status") VALUES
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Lefkosia Center'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Mesa Geitonia'), 5.0, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Mesa Geitonia'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Lefkosia Center'), 5.0, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Lefkosia Center'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Limassol Center'), 7.5, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Limassol Center'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Lefkosia Center'), 7.5, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Lefkosia Center'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Larnaca Center'), 6.0, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Larnaca Center'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Lefkosia Center'), 6.0, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Lefkosia Center'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Paphos Center'), 10.0, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Paphos Center'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Lefkosia Center'), 10.0, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Lefkosia Center'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Ayia Napa'), 8.0, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Ayia Napa'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Lefkosia Center'), 8.0, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Lefkosia Center'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Strovolos'), 2.5, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Strovolos'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Lefkosia Center'), 2.5, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Lefkosia Center'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Engomi'), 2.0, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Engomi'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Lefkosia Center'), 2.0, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Lefkosia Center'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Aglandjia'), 2.2, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Aglandjia'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Lefkosia Center'), 2.2, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Limassol Center'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Mesa Geitonia'), 3.0, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Mesa Geitonia'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Limassol Center'), 3.0, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Limassol Center'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Germasogeia'), 2.8, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Germasogeia'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Limassol Center'), 2.8, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Larnaca Center'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Aradippou'), 2.5, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Aradippou'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Larnaca Center'), 2.5, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Lefkosia Center'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Dali'), 4.0, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Dali'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Lefkosia Center'), 4.0, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Ayia Napa'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Protaras'), 3.5, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Protaras'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Ayia Napa'), 3.5, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Lefkosia Center'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Lakatamia'), 2.3, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Lakatamia'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Lefkosia Center'), 2.3, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Lefkosia Center'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Latsia'), 2.4, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Latsia'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Lefkosia Center'), 2.4, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Larnaca Center'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Oroklini'), 2.6, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Oroklini'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Larnaca Center'), 2.6, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Lefkosia Center'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Pera Chorio'), 3.8, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Pera Chorio'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Lefkosia Center'), 3.8, 'active')
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'DELETE FROM "commerce_service"."delivery_pricing"'
    );
    await queryRunner.query(
      'DELETE FROM "commerce_service"."delivery_location"'
    );
  }
}
