import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1721316052597 implements MigrationInterface {
    name = 'Init1721316052597'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`permissions\` (\`id\` int NOT NULL AUTO_INCREMENT, \`access_type\` varchar(255) NOT NULL, \`module\` varchar(255) NOT NULL, \`action\` varchar(255) NOT NULL, \`method\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`roles\` (\`id\` int NOT NULL AUTO_INCREMENT, \`title\` varchar(255) NOT NULL, \`access_type\` int NOT NULL, \`description\` varchar(255) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`users\` (\`id\` int NOT NULL AUTO_INCREMENT, \`username\` varchar(255) NOT NULL, \`role_ids\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`first_name\` varchar(255) NULL, \`last_name\` varchar(255) NULL, \`email\` varchar(255) NULL, \`last_login\` datetime NULL, \`hash_refresh_token\` text NULL, UNIQUE INDEX \`IDX_fe0bb3f6520ee0469504521e71\` (\`username\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`roles_users\` (\`role_id\` int NOT NULL, \`user_id\` int NOT NULL, PRIMARY KEY (\`role_id\`, \`user_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`roles_perms\` (\`role_id\` int NOT NULL, \`perm_id\` int NOT NULL, PRIMARY KEY (\`role_id\`, \`perm_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE INDEX \`IDX_67f8a1e3be2ea0f17564b871df\` ON \`roles_perms\` (\`perm_id\`)`);
        await queryRunner.query(`CREATE INDEX \`IDX_8cce8a13d529875e48b259a7f0\` ON \`roles_perms\` (\`role_id\`)`);
        await queryRunner.query(`CREATE INDEX \`IDX_de502d3ca59c0bfd32fa882939\` ON \`roles_users\` (\`role_id\`)`);
        await queryRunner.query(`CREATE INDEX \`IDX_fe845889e03e87003e6d9a06ca\` ON \`roles_users\` (\`user_id\`)`);
        await queryRunner.query(`ALTER TABLE \`roles_perms\` ADD CONSTRAINT \`FK_67f8a1e3be2ea0f17564b871dfb\` FOREIGN KEY (\`perm_id\`) REFERENCES \`permissions\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`roles_perms\` ADD CONSTRAINT \`FK_8cce8a13d529875e48b259a7f08\` FOREIGN KEY (\`role_id\`) REFERENCES \`roles\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`roles_users\` ADD CONSTRAINT \`FK_de502d3ca59c0bfd32fa8829393\` FOREIGN KEY (\`role_id\`) REFERENCES \`roles\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`roles_users\` ADD CONSTRAINT \`FK_fe845889e03e87003e6d9a06caa\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`roles_users\` DROP FOREIGN KEY \`FK_fe845889e03e87003e6d9a06caa\``);
        await queryRunner.query(`ALTER TABLE \`roles_users\` DROP FOREIGN KEY \`FK_de502d3ca59c0bfd32fa8829393\``);
        await queryRunner.query(`ALTER TABLE \`roles_perms\` DROP FOREIGN KEY \`FK_8cce8a13d529875e48b259a7f08\``);
        await queryRunner.query(`ALTER TABLE \`roles_perms\` DROP FOREIGN KEY \`FK_67f8a1e3be2ea0f17564b871dfb\``);
        await queryRunner.query(`DROP INDEX \`IDX_fe845889e03e87003e6d9a06ca\` ON \`roles_users\``);
        await queryRunner.query(`DROP INDEX \`IDX_de502d3ca59c0bfd32fa882939\` ON \`roles_users\``);
        await queryRunner.query(`DROP INDEX \`IDX_8cce8a13d529875e48b259a7f0\` ON \`roles_perms\``);
        await queryRunner.query(`DROP INDEX \`IDX_67f8a1e3be2ea0f17564b871df\` ON \`roles_perms\``);
        await queryRunner.query(`DROP TABLE \`roles_perms\``);
        await queryRunner.query(`DROP TABLE \`roles_users\``);
        await queryRunner.query(`DROP INDEX \`IDX_fe0bb3f6520ee0469504521e71\` ON \`users\``);
        await queryRunner.query(`DROP TABLE \`users\``);
        await queryRunner.query(`DROP TABLE \`roles\``);
        await queryRunner.query(`DROP TABLE \`permissions\``);
    }

}
