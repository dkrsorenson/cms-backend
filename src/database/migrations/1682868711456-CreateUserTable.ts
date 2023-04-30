import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateUserTable1682868711456 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "user" (
        "id" serial PRIMARY KEY,
        "uid" uuid NOT NULL DEFAULT uuid_generate_v4(),
	
        "username" varchar(64) NOT NULL,
        "pin_hash" varchar(128) NOT NULL,
        "status" varchar(64) NOT NULL,

        "created_at" timestamp NOT NULL DEFAULT current_timestamp,
        "updated_at" timestamp NOT NULL DEFAULT current_timestamp
      );

      ALTER TABLE "user" ADD CONSTRAINT "uq_user_uid" UNIQUE ("uid");
      ALTER TABLE "user" ADD CONSTRAINT "uq_user_username" UNIQUE ("username");

      CREATE TRIGGER "update_user_updated_at"
      BEFORE UPDATE ON "user"
        FOR EACH ROW
        WHEN (OLD.* IS DISTINCT FROM NEW.*)
        EXECUTE PROCEDURE update_updated_at_column();
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TRIGGER IF EXISTS "update_user_updated_at" ON "user";

      ALTER TABLE "user" DROP CONSTRAINT "uq_user_username";
      ALTER TABLE "user" DROP CONSTRAINT "uq_user_uid";

      DROP TABLE IF EXISTS "user";
    `)
  }
}
