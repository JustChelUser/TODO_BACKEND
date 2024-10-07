import { ApiProperty } from "@nestjs/swagger";
import {IsString, Length } from "class-validator";

export class createProjectDto {

    @ApiProperty({ example: 'UserName', description: 'Имя пользователя' })
    @IsString({ message: 'Должно быть строкой' })
    @Length(1, 100, { message: 'Не меньше 1 и не больше 100 символов' })
    readonly name: string;

    @ApiProperty({ example: 'Сделать что-то', description: 'Описание' })
    @IsString({ message: 'Должно быть строкой' })
    @Length(1, 255, { message: 'Не меньше 1 и не больше 255' })
    readonly description: string;
}