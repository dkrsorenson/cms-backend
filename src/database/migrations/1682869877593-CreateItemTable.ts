import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateItemTable1682869877593 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "item" (
        "id" serial PRIMARY KEY,
	
        "user_id" int NOT NULL,
        "title" varchar(256) NOT NULL,
        "content" TEXT NOT NULL,
        "status" varchar(64) NOT NULL,
        "visibility" varchar(64) NOT NULL,

        "created_at" timestamp NOT NULL DEFAULT current_timestamp,
        "updated_at" timestamp NOT NULL DEFAULT current_timestamp
      );

      ALTER TABLE "item" ADD CONSTRAINT "fk_item_user_id"
        FOREIGN KEY("user_id") REFERENCES "user"("id");

      CREATE INDEX "ix_item_status" ON "item"("status");
      CREATE INDEX "ix_item_visibility" ON "item"("visibility");

      CREATE TRIGGER "update_item_updated_at"
      BEFORE UPDATE ON "item"
        FOR EACH ROW
        WHEN (OLD.* IS DISTINCT FROM NEW.*)
        EXECUTE PROCEDURE update_updated_at_column();
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TRIGGER IF EXISTS "update_item_updated_at" ON "item";

      ALTER TABLE "user" DROP CONSTRAINT IF EXISTS "fk_item_user_id";

      DROP INDEX IF EXISTS "ix_item_status";
      DROP INDEX IF EXISTS "ix_item_visibility";

      DROP TABLE "item";
    `)
  }
}
