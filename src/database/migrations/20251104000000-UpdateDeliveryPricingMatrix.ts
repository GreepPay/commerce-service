import type { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateDeliveryPricingMatrix20251104000000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Delete existing delivery pricing first (due to foreign key constraints)
    await queryRunner.query(
      'DELETE FROM "commerce_service"."delivery_pricing"'
    );

    // Delete existing delivery locations
    await queryRunner.query(
      'DELETE FROM "commerce_service"."delivery_location"'
    );

    // Insert new delivery locations (14 locations)
    await queryRunner.query(`
      INSERT INTO "commerce_service"."delivery_location" ("country", "area", "status") VALUES
      ('North Cyprus', 'Haspolat', 'active'),
      ('North Cyprus', 'Hamitkoy', 'active'),
      ('North Cyprus', 'Kucuk Kayamakli', 'active'),
      ('North Cyprus', 'Mamara', 'active'),
      ('North Cyprus', 'Deraboyou', 'active'),
      ('North Cyprus', 'Metropol', 'active'),
      ('North Cyprus', 'Gocmencoy', 'active'),
      ('North Cyprus', 'Gonyeli', 'active'),
      ('North Cyprus', 'Guzelyurt City', 'active'),
      ('North Cyprus', 'Girne State', 'active'),
      ('North Cyprus', 'Gazimagusa State', 'active'),
      ('North Cyprus', 'Guzelyurt State', 'active'),
      ('North Cyprus', 'Iskele State', 'active'),
      ('North Cyprus', 'Lefke State', 'active')
    `);

    // Insert delivery pricing matrix (based on the CSV price matrix)
    await queryRunner.query(`
      INSERT INTO "commerce_service"."delivery_pricing" ("originLocationId", "destinationLocationId", "price", "status") VALUES
        -- Haspolat routes
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Haspolat'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Hamitkoy'), 200, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Haspolat'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Kucuk Kayamakli'), 200, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Haspolat'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Mamara'), 250, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Haspolat'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Deraboyou'), 250, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Haspolat'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Metropol'), 250, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Haspolat'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Gocmencoy'), 250, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Haspolat'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Gonyeli'), 250, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Haspolat'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Guzelyurt City'), 350, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Haspolat'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Girne State'), 450, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Haspolat'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Gazimagusa State'), 1000, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Haspolat'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Guzelyurt State'), 1000, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Haspolat'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Iskele State'), 1200, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Haspolat'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Lefke State'), 1000, 'active'),
        -- Hamitkoy routes
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Hamitkoy'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Haspolat'), 200, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Hamitkoy'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Kucuk Kayamakli'), 150, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Hamitkoy'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Mamara'), 150, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Hamitkoy'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Deraboyou'), 150, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Hamitkoy'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Metropol'), 150, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Hamitkoy'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Gocmencoy'), 150, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Hamitkoy'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Gonyeli'), 150, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Hamitkoy'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Guzelyurt City'), 250, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Hamitkoy'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Girne State'), 450, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Hamitkoy'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Gazimagusa State'), 1000, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Hamitkoy'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Guzelyurt State'), 1000, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Hamitkoy'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Iskele State'), 1200, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Hamitkoy'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Lefke State'), 1000, 'active'),
        -- Kucuk Kayamakli routes
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Kucuk Kayamakli'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Haspolat'), 200, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Kucuk Kayamakli'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Hamitkoy'), 150, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Kucuk Kayamakli'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Mamara'), 150, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Kucuk Kayamakli'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Deraboyou'), 150, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Kucuk Kayamakli'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Metropol'), 150, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Kucuk Kayamakli'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Gocmencoy'), 150, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Kucuk Kayamakli'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Gonyeli'), 150, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Kucuk Kayamakli'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Guzelyurt City'), 250, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Kucuk Kayamakli'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Girne State'), 450, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Kucuk Kayamakli'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Gazimagusa State'), 1000, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Kucuk Kayamakli'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Guzelyurt State'), 1000, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Kucuk Kayamakli'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Iskele State'), 1200, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Kucuk Kayamakli'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Lefke State'), 1000, 'active'),
        -- Mamara routes
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Mamara'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Haspolat'), 250, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Mamara'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Hamitkoy'), 150, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Mamara'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Kucuk Kayamakli'), 150, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Mamara'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Deraboyou'), 150, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Mamara'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Metropol'), 150, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Mamara'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Gocmencoy'), 150, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Mamara'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Gonyeli'), 150, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Mamara'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Guzelyurt City'), 250, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Mamara'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Girne State'), 450, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Mamara'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Gazimagusa State'), 1000, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Mamara'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Guzelyurt State'), 1000, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Mamara'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Iskele State'), 1200, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Mamara'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Lefke State'), 1000, 'active'),
        -- Deraboyou routes
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Deraboyou'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Haspolat'), 250, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Deraboyou'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Hamitkoy'), 150, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Deraboyou'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Kucuk Kayamakli'), 150, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Deraboyou'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Mamara'), 150, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Deraboyou'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Metropol'), 150, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Deraboyou'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Gocmencoy'), 150, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Deraboyou'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Gonyeli'), 150, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Deraboyou'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Guzelyurt City'), 250, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Deraboyou'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Girne State'), 450, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Deraboyou'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Gazimagusa State'), 1000, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Deraboyou'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Guzelyurt State'), 1000, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Deraboyou'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Iskele State'), 1200, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Deraboyou'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Lefke State'), 1000, 'active'),
        -- Metropol routes
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Metropol'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Haspolat'), 250, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Metropol'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Hamitkoy'), 150, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Metropol'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Kucuk Kayamakli'), 150, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Metropol'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Mamara'), 150, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Metropol'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Deraboyou'), 150, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Metropol'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Gocmencoy'), 150, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Metropol'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Gonyeli'), 150, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Metropol'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Guzelyurt City'), 250, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Metropol'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Girne State'), 450, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Metropol'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Gazimagusa State'), 1000, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Metropol'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Guzelyurt State'), 1000, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Metropol'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Iskele State'), 1200, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Metropol'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Lefke State'), 1000, 'active'),
        -- Gocmencoy routes
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Gocmencoy'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Haspolat'), 250, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Gocmencoy'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Hamitkoy'), 150, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Gocmencoy'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Kucuk Kayamakli'), 150, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Gocmencoy'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Mamara'), 150, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Gocmencoy'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Deraboyou'), 150, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Gocmencoy'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Metropol'), 150, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Gocmencoy'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Gonyeli'), 150, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Gocmencoy'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Guzelyurt City'), 250, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Gocmencoy'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Girne State'), 450, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Gocmencoy'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Gazimagusa State'), 1000, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Gocmencoy'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Guzelyurt State'), 1000, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Gocmencoy'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Iskele State'), 1200, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Gocmencoy'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Lefke State'), 1000, 'active'),
        -- Gonyeli routes
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Gonyeli'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Haspolat'), 250, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Gonyeli'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Hamitkoy'), 150, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Gonyeli'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Kucuk Kayamakli'), 150, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Gonyeli'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Mamara'), 150, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Gonyeli'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Deraboyou'), 150, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Gonyeli'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Metropol'), 150, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Gonyeli'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Gocmencoy'), 150, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Gonyeli'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Guzelyurt City'), 250, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Gonyeli'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Girne State'), 450, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Gonyeli'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Gazimagusa State'), 1000, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Gonyeli'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Guzelyurt State'), 1000, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Gonyeli'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Iskele State'), 1200, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Gonyeli'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Lefke State'), 1000, 'active'),
        -- Guzelyurt City routes
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Guzelyurt City'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Haspolat'), 350, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Guzelyurt City'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Hamitkoy'), 250, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Guzelyurt City'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Kucuk Kayamakli'), 250, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Guzelyurt City'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Mamara'), 250, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Guzelyurt City'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Deraboyou'), 250, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Guzelyurt City'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Metropol'), 250, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Guzelyurt City'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Gocmencoy'), 250, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Guzelyurt City'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Gonyeli'), 250, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Guzelyurt City'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Girne State'), 450, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Guzelyurt City'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Gazimagusa State'), 1000, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Guzelyurt City'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Guzelyurt State'), 1000, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Guzelyurt City'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Iskele State'), 1200, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Guzelyurt City'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Lefke State'), 1000, 'active'),
        -- Girne State routes
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Girne State'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Haspolat'), 450, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Girne State'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Hamitkoy'), 450, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Girne State'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Kucuk Kayamakli'), 450, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Girne State'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Mamara'), 450, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Girne State'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Deraboyou'), 450, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Girne State'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Metropol'), 450, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Girne State'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Gocmencoy'), 450, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Girne State'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Gonyeli'), 450, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Girne State'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Guzelyurt City'), 450, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Girne State'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Gazimagusa State'), 0, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Girne State'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Guzelyurt State'), 0, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Girne State'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Iskele State'), 0, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Girne State'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Lefke State'), 0, 'active'),
        -- Gazimagusa State routes
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Gazimagusa State'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Haspolat'), 1000, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Gazimagusa State'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Hamitkoy'), 1000, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Gazimagusa State'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Kucuk Kayamakli'), 1000, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Gazimagusa State'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Mamara'), 1000, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Gazimagusa State'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Deraboyou'), 1000, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Gazimagusa State'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Metropol'), 1000, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Gazimagusa State'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Gocmencoy'), 1000, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Gazimagusa State'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Gonyeli'), 1000, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Gazimagusa State'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Guzelyurt City'), 1000, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Gazimagusa State'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Girne State'), 0, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Gazimagusa State'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Guzelyurt State'), 0, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Gazimagusa State'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Iskele State'), 0, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Gazimagusa State'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Lefke State'), 0, 'active'),
        -- Guzelyurt State routes
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Guzelyurt State'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Haspolat'), 1000, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Guzelyurt State'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Hamitkoy'), 1000, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Guzelyurt State'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Kucuk Kayamakli'), 1000, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Guzelyurt State'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Mamara'), 1000, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Guzelyurt State'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Deraboyou'), 1000, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Guzelyurt State'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Metropol'), 1000, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Guzelyurt State'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Gocmencoy'), 1000, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Guzelyurt State'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Gonyeli'), 1000, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Guzelyurt State'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Guzelyurt City'), 1000, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Guzelyurt State'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Girne State'), 0, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Guzelyurt State'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Gazimagusa State'), 0, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Guzelyurt State'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Iskele State'), 0, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Guzelyurt State'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Lefke State'), 0, 'active'),
        -- Iskele State routes
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Iskele State'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Haspolat'), 1200, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Iskele State'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Hamitkoy'), 1200, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Iskele State'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Kucuk Kayamakli'), 1200, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Iskele State'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Mamara'), 1200, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Iskele State'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Deraboyou'), 1200, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Iskele State'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Metropol'), 1200, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Iskele State'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Gocmencoy'), 1200, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Iskele State'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Gonyeli'), 1200, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Iskele State'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Guzelyurt City'), 1200, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Iskele State'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Girne State'), 0, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Iskele State'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Gazimagusa State'), 0, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Iskele State'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Guzelyurt State'), 0, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Iskele State'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Lefke State'), 0, 'active'),
        -- Lefke State routes
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Lefke State'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Haspolat'), 1000, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Lefke State'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Hamitkoy'), 1000, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Lefke State'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Kucuk Kayamakli'), 1000, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Lefke State'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Mamara'), 1000, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Lefke State'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Deraboyou'), 1000, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Lefke State'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Metropol'), 1000, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Lefke State'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Gocmencoy'), 1000, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Lefke State'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Gonyeli'), 1000, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Lefke State'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Guzelyurt City'), 1000, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Lefke State'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Girne State'), 0, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Lefke State'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Gazimagusa State'), 0, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Lefke State'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Guzelyurt State'), 0, 'active'),
        ((SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Lefke State'), (SELECT id FROM "commerce_service"."delivery_location" WHERE area = 'Iskele State'), 0, 'active')
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Delete delivery pricing
    await queryRunner.query(
      'DELETE FROM "commerce_service"."delivery_pricing"'
    );

    // Delete all delivery locations
    await queryRunner.query(
      'DELETE FROM "commerce_service"."delivery_location"'
    );
  }
}
