import type { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateNorthCyprusLocations1729880400000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Delete existing delivery pricing first (due to foreign key constraints)
    await queryRunner.query(
      'DELETE FROM "commerce_service"."delivery_pricing"'
    );

    // Delete existing delivery locations
    await queryRunner.query(
      'DELETE FROM "commerce_service"."delivery_location"'
    );

    // Insert new North Cyprus locations
    await queryRunner.query(`
      INSERT INTO "commerce_service"."delivery_location" ("country", "area", "status") VALUES
      ('North Cyprus', 'Hamitkoy', 'active'),
      ('North Cyprus', 'Haspolat', 'active'),
      ('North Cyprus', 'Gonyeli', 'active'),
      ('North Cyprus', 'Gocmencoy', 'active'),
      ('North Cyprus', 'Mamara', 'active'),
      ('North Cyprus', 'Metropol', 'active'),
      ('North Cyprus', 'Kucuk Kayamakli', 'active'),
      ('North Cyprus', 'Guzelyurt', 'active'),
      ('North Cyprus', 'Girne', 'active'),
      ('North Cyprus', 'Magusa', 'active'),
      ('North Cyprus', 'Lefke', 'active'),
      ('North Cyprus', 'Iskele', 'active')
    `);

    // Insert delivery pricing for North Cyprus locations
    await queryRunner.query(`
      INSERT INTO "commerce_service"."delivery_pricing" ("originLocationId", "destinationLocationId", "price", "status") VALUES
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Hamitkoy'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Haspolat'), 3.5, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Haspolat'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Hamitkoy'), 3.5, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Hamitkoy'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Gonyeli'), 4.0, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Gonyeli'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Hamitkoy'), 4.0, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Hamitkoy'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Gocmencoy'), 3.0, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Gocmencoy'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Hamitkoy'), 3.0, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Hamitkoy'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Mamara'), 2.5, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Mamara'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Hamitkoy'), 2.5, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Hamitkoy'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Metropol'), 5.0, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Metropol'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Hamitkoy'), 5.0, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Gonyeli'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Kucuk Kayamakli'), 2.0, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Kucuk Kayamakli'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Gonyeli'), 2.0, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Gonyeli'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Guzelyurt'), 6.5, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Guzelyurt'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Gonyeli'), 6.5, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Metropol'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Girne'), 4.5, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Girne'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Metropol'), 4.5, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Metropol'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Magusa'), 7.0, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Magusa'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Metropol'), 7.0, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Girne'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Lefke'), 5.5, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Lefke'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Girne'), 5.5, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Magusa'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Iskele'), 3.0, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Iskele'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Magusa'), 3.0, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Hamitkoy'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Girne'), 8.0, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Girne'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Hamitkoy'), 8.0, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Haspolat'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Metropol'), 6.0, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Metropol'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Haspolat'), 6.0, 'active')
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Delete delivery pricing
    await queryRunner.query(
      'DELETE FROM "commerce_service"."delivery_pricing"'
    );

    // Delete North Cyprus locations
    await queryRunner.query(
      'DELETE FROM "commerce_service"."delivery_location"'
    );

    // Restore previous Cyprus locations
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

    // Restore previous pricing data
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
}
