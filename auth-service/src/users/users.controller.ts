import { Body, Controller, Delete, Get, Injectable, Param, Post, Put, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { UsersService } from "./users.service";
import { User } from "./users.entity";
import { createUserDto } from "./dto/create-user.dto";
import { updateUserDto } from "./dto/update-user.dto";
import { MessagePattern, Payload, RpcException } from "@nestjs/microservices";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";

Injectable()
@ApiTags('Пользователи')
@Controller('users')
export class UsersController {

    constructor(private userService: UsersService) { }

    @ApiOperation({ summary: 'Создание пользователя' })
    @ApiResponse({ status: 200, type: User })
    @Post()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    createProject(@Body() userDto: createUserDto, @Req() req) {
        return this.userService.createUserManualy(userDto, req);
    }

    @ApiOperation({ summary: 'Получить всех пользователей' })
    @ApiResponse({ status: 200, type: [User] })
    @ApiBearerAuth()
    @Get()
    @UseGuards(JwtAuthGuard)
    getAllProjects(@Req() req) {
        return this.userService.getAllUsers(req);
    }

    @ApiOperation({ summary: 'Получить одного пользователя' })
    @ApiResponse({ status: 200, type: User })
    @Get('/:value')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    getOneProject(@Param('value') id: number, @Req() req) {
        return this.userService.getOneUser(id, req);
    }

    @ApiOperation({ summary: 'Обновить пользователя' })
    @ApiResponse({ status: 200, type: User })
    @Put('/:id')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    updateProject(@Body() updateUser: updateUserDto, @Param('id') id: number, @Req() req) {
        return this.userService.updateUser(id, updateUser, req);
    }

    @ApiOperation({ summary: 'Удалить пользователя' })
    @ApiResponse({ status: 200 })
    @Delete('/:id')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    deleteProject(@Param('id') id: number, @Req() req) {
        return this.userService.removeUser(id, req);
    }

    @MessagePattern({ cmd: 'getUserByEmail' })
    async getUserByEmail(@Payload() email: string) {
        try {
            const response = await this.userService.getUserByEmail(email);
            return response;
        }
        catch (error) {
            console.error('Не удалось получить пользователя по email:', error.message);
            throw new RpcException('Ошибка при получении данных');
        }
    }
}
