import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from "@nestjs/common";
import { ProjectsService } from "./projects.service";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Project } from "./projects.entity";
import { createProjectDto } from "./dto/create-project.dto";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";

@ApiTags('Проекты')
@Controller('projects')
export class ProjectsController {

    constructor(private projectsService: ProjectsService) { }

    @ApiOperation({ summary: 'Создание проекта' })
    @ApiResponse({ status: 200, type: Project })
    @Post()
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    createProject(@Body() projectDto: createProjectDto, @Req() req) {
        return this.projectsService.createProject(projectDto, req);
    }

    @ApiOperation({ summary: 'Получить все проекты' })
    @ApiResponse({ status: 200, type: [Project] })
    @Get()
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    getAllProjects(@Req() req) {
        return this.projectsService.getAllProjects(req);
    }

    @ApiOperation({ summary: 'Получить один проект' })
    @ApiResponse({ status: 200, type: Project })
    @Get('/:value')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    getOneProject(@Param('value') id: number, @Req() req) {
        return this.projectsService.getOneProject(id, req);
    }


    @ApiOperation({ summary: 'Обновить проект' })
    @ApiResponse({ status: 200, type: Project })
    @Put('/:id')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    updateProject(@Body() projectDto: createProjectDto, @Param('id') id: number, @Req() req) {
        return this.projectsService.updateProject(id, projectDto, req);
    }

    @ApiOperation({ summary: 'Удалить проект' })
    @ApiResponse({ status: 200 })
    @Delete('/:id')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    deleteProject(@Param('id') id: number, @Req() req) {
        return this.projectsService.removeProject(id, req);
    }
}
