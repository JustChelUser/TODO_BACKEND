import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsPositive, IsString, Length } from "class-validator";

export class createTaskDto {

    @ApiProperty({ example: 'Сделать что-то', description: 'Название задачи' })
    @IsString({ message: 'Должно быть строкой' })
    @Length(1, 100, { message: 'Не меньше 1 и не больше 100 символов' })
    readonly name: string;

    @ApiProperty({ example: 'Задача такая-то и нужно сделать вот так', description: 'Описание задачи' })
    @IsString({ message: 'Должно быть строкой' })
    @Length(1, 255, { message: 'Не меньше 1 и не больше 255 символов' })
    readonly description: string;

    @ApiProperty({ example: 1, description: 'Позиция задачи в списке задач' })
    @IsOptional() @IsPositive({ message: 'Должно быть больше 0' })  @IsNumber({}, { message: 'Должно быть числом' })
    position?: number;

    @ApiProperty({ example: 1, description: 'Номер списка задач в котором будет находиться задача' })
    @IsNumber({}, { message: 'Должно быть числом' })
    readonly listId: number;
}