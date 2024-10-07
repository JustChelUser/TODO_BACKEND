import { ApiProperty } from "@nestjs/swagger";
import { IsNumber,IsPositive} from "class-validator";

export class ChangePositionListDto {
    @ApiProperty({ example: 1, description: 'Позиция задачи среди других задач' })
    @IsPositive({ message: 'Должно быть больше 0' }) @IsNumber({}, { message: 'Должно быть числом' })
    position: number;
}