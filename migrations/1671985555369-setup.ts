import { MigrationInterface, QueryRunner } from 'typeorm';

export class setup1671985555369 implements MigrationInterface {
  name = 'setup1671985555369';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" SERIAL NOT NULL,
        "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "username" character varying(64) UNIQUE NOT NULL,
        "password" character varying(1024) NOT NULL,
        "status" "public"."users_status_enum" NOT NULL DEFAULT 'pending',
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`CREATE UNIQUE INDEX "IDX_8340d110121f637ff3ad670729" ON "users" ("uuid", "username")`);
    await queryRunner.query(`
      CREATE TABLE "role_mapping" (
        "id" SERIAL NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "roleId" integer,
        "userId" integer,
        CONSTRAINT "PK_48235f8b9c75b20b5cddd2eae91" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`
      CREATE TABLE "roles" (
        "id" SERIAL NOT NULL,
        "name" character varying(32) UNIQUE NOT NULL,
        "description" character varying(255),
        "status" "public"."roles_status_enum" NOT NULL DEFAULT '1',
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`
      CREATE TABLE "seeds" (
        "id" SERIAL NOT NULL,
        "name" character varying(128) NOT NULL,
        "timestamp" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_3ac799e4ece18bc838823bb6a4b" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`
      ALTER TABLE "role_mapping"
      ADD CONSTRAINT "FK_72fc8ca8521491cbf3c04e31752" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
      ALTER TABLE "role_mapping"
      ADD CONSTRAINT "FK_c7c1bb73f89bbdd47b4afb1bab9" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "role_mapping" DROP CONSTRAINT "FK_c7c1bb73f89bbdd47b4afb1bab9"`);
    await queryRunner.query(`ALTER TABLE "role_mapping" DROP CONSTRAINT "FK_72fc8ca8521491cbf3c04e31752"`);
    await queryRunner.query(`DROP TABLE "seeds"`);
    await queryRunner.query(`DROP TABLE "roles"`);
    await queryRunner.query(`DROP TABLE "role_mapping"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_8340d110121f637ff3ad670729"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
