import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSetup1698488931633 implements MigrationInterface {
  name = 'InitialSetup1698488931633';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE \`Users\`
      (
        \`id\`        int           NOT NULL AUTO_INCREMENT,
        \`uuid\`      varchar(36)   NOT NULL,
        \`username\`  varchar(64)   NOT NULL,
        \`email\`     varchar(64)   NULL,
        \`password\`  varchar(1024) NOT NULL,
        \`status\`    varchar(16)   NOT NULL DEFAULT 'PENDING',
        \`createdAt\` timestamp(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updatedAt\` timestamp(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        UNIQUE INDEX \`IDX_1000372dcdf71d6855fde65be2\` (\`uuid\`, \`username\`),
        UNIQUE INDEX \`IDX_ffc81a3b97dcbf8e320d5106c0\` (\`username\`),
        UNIQUE INDEX \`IDX_3c3ab3f49a87e6ddb607f3c494\` (\`email\`),
        PRIMARY KEY (\`id\`)
      ) ENGINE = InnoDB
    `);
    await queryRunner.query(`
      CREATE TABLE \`RolaMappings\`
      (
        \`id\`        int          NOT NULL AUTO_INCREMENT,
        \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`roleId\`    int          NULL,
        \`userId\`    int          NULL,
        PRIMARY KEY (\`id\`)
      ) ENGINE = InnoDB
    `);
    await queryRunner.query(`
      CREATE TABLE \`Roles\`
      (
        \`id\`          int          NOT NULL AUTO_INCREMENT,
        \`name\`        varchar(32)  NOT NULL,
        \`description\` varchar(255) NULL,
        \`status\`      varchar(16)  NOT NULL DEFAULT 'OPEN',
        \`createdAt\`   timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updatedAt\`   timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        UNIQUE INDEX \`IDX_8eadedb8470c92966389ecc216\` (\`name\`),
        PRIMARY KEY (\`id\`)
      ) ENGINE = InnoDB
    `);
    await queryRunner.query(`
      CREATE TABLE \`seeds\`
      (
        \`id\`        int          NOT NULL AUTO_INCREMENT,
        \`name\`      varchar(128) NOT NULL,
        \`timestamp\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`)
      ) ENGINE = InnoDB
    `);
    await queryRunner.query(`
      ALTER TABLE \`RolaMappings\`
        ADD CONSTRAINT \`FK_56412b41a045780624f67694160\` FOREIGN KEY (\`roleId\`) REFERENCES \`Roles\` (\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
      ALTER TABLE \`RolaMappings\`
        ADD CONSTRAINT \`FK_922223fc5063e34f2b6b9cb82ea\` FOREIGN KEY (\`userId\`) REFERENCES \`Users\` (\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE \`RolaMappings\`
        DROP FOREIGN KEY \`FK_922223fc5063e34f2b6b9cb82ea\`
    `);
    await queryRunner.query(`
      ALTER TABLE \`RolaMappings\`
        DROP FOREIGN KEY \`FK_56412b41a045780624f67694160\`
    `);
    await queryRunner.query(`
      DROP TABLE \`seeds\`
    `);
    await queryRunner.query(`
      DROP INDEX \`IDX_8eadedb8470c92966389ecc216\` ON \`Roles\`
    `);
    await queryRunner.query(`
      DROP TABLE \`Roles\`
    `);

    await queryRunner.query(`
      DROP TABLE \`RolaMappings\`
    `);
    await queryRunner.query(`
      DROP INDEX \`IDX_3c3ab3f49a87e6ddb607f3c494\` ON \`Users\`
    `);
    await queryRunner.query(`
      DROP INDEX \`IDX_ffc81a3b97dcbf8e320d5106c0\` ON \`Users\`
    `);
    await queryRunner.query(`
      DROP INDEX \`IDX_1000372dcdf71d6855fde65be2\` ON \`Users\`
    `);
    await queryRunner.query(`
      DROP TABLE \`Users\`
    `);
  }
}
