import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateItemTable1682784263553 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE "item" (
            "id" serial PRIMARY KEY,
	
            "title" varchar(256) NOT NULL,
            "description" varchar(256) NOT NULL,
            "is_active" bool NOT NULL
        );
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "item"`)
  }
}
