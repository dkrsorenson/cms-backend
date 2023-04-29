import { MigrationInterface, QueryRunner } from 'typeorm'

export class SeedItemTable1682787018376 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        INSERT INTO "items" ("title", "description", "is_active")
            VALUES('Testing', 'Testing 12345', true);
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "items"`)
  }
}
