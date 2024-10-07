import { ApiProperty } from "@nestjs/swagger";
import {IsString, Length } from "class-validator";

export class updateTaskDto {

    @ApiProperty({ example: 'Сделать что-то', description: 'Название задачи' })
    @IsString({ message: 'Должно быть строкой' })
    @Length(1, 100, { message: 'Не меньше 1 и не больше 100 символов' })
    readonly name: string;

    @ApiProperty({ example: 'Задача такая-то и нужно сделать вот так', description: 'Описание задачи' })
    @IsString({ message: 'Должно быть строкой' })
    @Length(1, 255, { message: 'Не меньше 1 и не больше 255 символов' })
    readonly description: string;
}