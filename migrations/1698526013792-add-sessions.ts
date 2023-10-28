import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSessions1698526013792 implements MigrationInterface {
  name = 'AddSessions1698526013792';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE \`Sessions\`
      (
        \`id\`        int          NOT NULL AUTO_INCREMENT,
        \`session\`   varchar(255) NOT NULL,
        \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        \`expiresAt\` timestamp    NOT NULL,
        \`userAgent\` text         NOT NULL,
        \`userId\`    int          NULL,
        UNIQUE INDEX \`IDX_0da8a4ba0998828ad214800169\` (\`session\`),
        PRIMARY KEY (\`id\`)
      ) ENGINE = InnoDB
    `);
    await queryRunner.query(`
      ALTER TABLE \`Sessions\`
        ADD CONSTRAINT \`FK_582c3cb0fcddddf078b33e316d3\` FOREIGN KEY (\`userId\`) REFERENCES \`Users\` (\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE \`Sessions\`
        DROP FOREIGN KEY \`FK_582c3cb0fcddddf078b33e316d3\`
    `);
    await queryRunner.query(`
      DROP INDEX \`IDX_0da8a4ba0998828ad214800169\` ON \`Sessions\`
    `);
    await queryRunner.query(`
      DROP TABLE \`Sessions\`
    `);
  }
}
