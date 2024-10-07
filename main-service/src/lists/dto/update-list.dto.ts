import { ApiProperty } from "@nestjs/swagger";
import {IsString, Length } from "class-validator";

export class updateListDto {

    @ApiProperty({ example: 'Задачи на сегодня', description: 'Название списка задач' })
    @IsString({ message: 'Должно быть строкой' })
    @Length(1, 100, { message: 'Не меньше 1 и не больше 100 символов' })
    readonly name: string;
}