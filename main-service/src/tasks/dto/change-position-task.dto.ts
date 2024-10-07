import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsPositive} from "class-validator";

export class changePositionTaskDto {
    @ApiProperty({ example: 1, description: 'Позиция задачи в списке задач' })
    @IsOptional() @IsNumber({}, { message: 'Должно быть числом' })
    position: number;

    @ApiProperty({ example: 1, description: 'Номер списка задач в котором будет находиться задача' })
    @IsPositive({ message: 'Должно быть больше 0' }) @IsNumber({}, { message: 'Должно быть числом' })
    readonly listId: number;
}