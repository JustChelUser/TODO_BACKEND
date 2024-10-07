import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsEmail, IsOptional, IsString, Length } from "class-validator";

export class updateUserDto {

    @ApiProperty({ example: 'user@mail.ru', description: 'Почтовый адрес' })
    @IsString({ message: 'Должно быть строкой' })
    @IsEmail({}, { message: "Некорректный email" })
    readonly email: string;

    @ApiProperty({ example: '12345678', description: 'Пароль' })
    @IsString({ message: 'Должно быть строкой' })
    @Length(4, 255, { message: 'Не меньше 4 и не больше 255' })
    password: string;

    @ApiProperty({ example: 'false', description: 'Флаг администратора' })
    @IsOptional() @IsBoolean({ message: 'Должно быть булевым значением' })
    readonly is_admin: boolean;
}