import { MigrationInterface, QueryRunner } from "typeorm";
import * as bcrypt from 'bcrypt';

export class AddAdminUser1709123456791 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const hashedPassword = await bcrypt.hash('admin123', 10);
        
        await queryRunner.query(`
            INSERT INTO "users" ("firstName", "lastName", "email", "password")
            VALUES ('Admin', 'User', 'admin@example.com', $1)
        `, [hashedPassword]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DELETE FROM "users" WHERE "email" = 'admin@example.com'
        `);
    }
}