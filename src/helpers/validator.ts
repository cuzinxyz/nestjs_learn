import { Injectable } from "@nestjs/common";
import { ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface, registerDecorator } from "class-validator";
import { EntityManager } from "typeorm";

export type IsUniqeInterface = {
    tableName: string;
    column: string;
    exceptId?: number;
}

@ValidatorConstraint({name: 'IsUniqueConstraint', async: true})
@Injectable()
export class IsUniqueConstraint implements ValidatorConstraintInterface {
    constructor(private readonly entityManager: EntityManager) {}
    
    async validate(
        value: any,
        args?: ValidationArguments
    ): Promise<boolean> {
        const {tableName, column, exceptId}: IsUniqeInterface = args?.constraints?.[0] ?? { tableName: '', column: '' };

        // Build the query
        const query = this.entityManager.getRepository(tableName)
            .createQueryBuilder(tableName)
            .where(`${tableName}.${column} = :value`, { value });

        // Add exceptId condition if provided
        if (exceptId !== undefined) {
            query.andWhere(`${tableName}.id != :id`, { id: exceptId });
        }

        const dataExist = await query.getExists();
        return !dataExist;
    }

    defaultMessage(validationArguments?: ValidationArguments): string {
        const field: string = validationArguments?.property ?? 'unknown';
        return `${field} is already in use`;
    }
}


// decorator function
export function isUnique(options: IsUniqeInterface, validationOptions?: ValidationOptions) {
    return function (object: any, propertyName: string) {
        registerDecorator({
            name: 'isUnique',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [options],
            validator: IsUniqueConstraint,
        })
    }
}
