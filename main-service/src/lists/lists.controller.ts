import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ListsService } from "./lists.service";
import { List } from "./lists.entity";
import { createListDto } from "./dto/create-list.dto";
import { updateListDto } from "./dto/update-list.dto";
import { ChangePositionListDto } from "./dto/change-position-list.dto";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";

@ApiTags('Списки задач')
@Controller('lists')
export class ListsController {

    constructor(private listsService: ListsService) { }

    @ApiOperation({ summary: 'Создание списка задач' })
    @ApiResponse({ status: 200, type: List })
    @Post()
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    createList(@Body() listDto: createListDto, @Req() req) {
        return this.listsService.createList(listDto, req);
    }

    @ApiOperation({ summary: 'Получить все списки задач' })
    @ApiResponse({ status: 200, type: [List] })
    @Get()
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    getAllLists(@Req() req) {
        return this.listsService.getAllLists(req);
    }

    @ApiOperation({ summary: 'Получить один список задач' })
    @ApiResponse({ status: 200, type: List })
    @Get('/:id')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    getOneList(@Param('id') id: number, @Req() req) {
        return this.listsService.getOneList(id, req);
    }


    @ApiOperation({ summary: 'Обновить список задач' })
    @ApiResponse({ status: 200, type: List })
    @Put('/:id')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    updateList(@Body() listDto: updateListDto, @Param('id') id: number, @Req() req) {
        return this.listsService.updateList(id, listDto, req);
    }

    @ApiOperation({ summary: 'Обновить позицию задачи' })
    @ApiResponse({ status: 200, type: List })
    @Put('/position/:id')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    updateListPosition(@Body() listDto: ChangePositionListDto, @Param('id') id: number, @Req() req) {
        return this.listsService.updateListPosition(id, listDto, req);
    }

    @ApiOperation({ summary: 'Удалить список задач' })
    @ApiResponse({ status: 200 })
    @Delete('/:id')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    deleteList(@Param('id') id: number,@Req() req) {
        return this.listsService.removeList(id,req);
    }
}
