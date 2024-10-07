import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";
import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import { ValidationException } from "src/exceptions/validation.exception";

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
    async transform(value: any, metadata: ArgumentMetadata): Promise<any> {
        if (!metadata.metatype || !this.toValidate(metadata.metatype)) {
            return value; // возвращаем значение, если нет валидации
        }

        const obj = plainToClass(metadata.metatype, value);
        const errors = await validate(obj);
        if (errors.length) {
            const messages = errors.map(err => {
                return `${err.property} - ${Object.values(err.constraints).join(', ')}`;
            });
            throw new ValidationException(messages);
        }
        return value;
    }

    private toValidate(metatype: any) {
        const types = [String, Boolean, Number,Object];
        return !types.includes(metatype);
    }
}