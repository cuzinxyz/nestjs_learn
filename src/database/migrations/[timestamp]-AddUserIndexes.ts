import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserIndexes1709123456790 implements MigrationInterface {
    name = 'AddUserIndexes1709123456790'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Index for email searches
        await queryRunner.query(`
            CREATE INDEX "IDX_user_email" ON "users" ("email")
        `);

        // Index for name searches
        await queryRunner.query(`
            CREATE INDEX "IDX_user_name" ON "users" ("firstName", "lastName")
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_user_email"`);
        await queryRunner.query(`DROP INDEX "IDX_user_name"`);
    }
}