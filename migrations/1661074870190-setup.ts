import { MigrationInterface, QueryRunner } from 'typeorm';

export class setup1661074870190 implements MigrationInterface {
  name = 'setup1661074870190';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TYPE "public"."users_status_enum" AS ENUM('active', 'pending', 'suspended', 'deleted')
        `);
    await queryRunner.query(`
            CREATE TABLE "users" (
                "id" SERIAL NOT NULL,
                "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "username" character varying(64) NOT NULL,
                "password" character varying(1024) NOT NULL,
                "status" "public"."users_status_enum" NOT NULL DEFAULT 'pending',
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE UNIQUE INDEX "IDX_951b8f1dfc94ac1d0301a14b7e" ON "users" ("uuid")
        `);
    await queryRunner.query(`
            CREATE TYPE "public"."roles_status_enum" AS ENUM('0', '1')
        `);
    await queryRunner.query(`
            CREATE TABLE "roles" (
                "id" SERIAL NOT NULL,
                "name" character varying(32) NOT NULL,
                "description" character varying(255),
                "status" "public"."roles_status_enum" NOT NULL DEFAULT '1',
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "userId" integer,
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
            ALTER TABLE "roles"
            ADD CONSTRAINT "FK_c8db5603420d119933bbc5c398c" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "roles" DROP CONSTRAINT "FK_c8db5603420d119933bbc5c398c"`,
    );
    await queryRunner.query(`DROP TABLE "seeds"`);
    await queryRunner.query(`DROP TABLE "roles"`);
    await queryRunner.query(`DROP TYPE "public"."roles_status_enum"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_951b8f1dfc94ac1d0301a14b7e"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TYPE "public"."users_status_enum"`);
  }
}
