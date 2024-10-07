import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Project } from "./projects.entity";
import { Repository } from "typeorm";
import { createProjectDto } from "./dto/create-project.dto";
import { UsersService } from "src/users/users.service";

@Injectable()
export class ProjectsService {
    constructor(
        @InjectRepository(Project)
        private projectRepository: Repository<Project>,
        private userService: UsersService

    ) { }
    async createProject(dto: createProjectDto, req) {
        try {
            const email = req.user.email;
            let user = await this.userService.getUserByEmail(email);
            if (!user) {
                throw new HttpException('Пользователь с таким email не найден', HttpStatus.NOT_FOUND);
            }
            const project = this.projectRepository.create({ ...dto, userId: user.id });
            await this.projectRepository.save(project);
            return project;
        } catch (error) {
            console.error('Не удалось создать проект:', error.message);
            if (error instanceof HttpException) {
                throw error;
            }
            else {
                throw new HttpException('Возникла ошибка при попытке создания проекта', HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }

    async getAllProjects(req) {
        try {
            const email = req.user.email;
            let user = await this.userService.getUserByEmail(email);
            if (!user) {
                throw new HttpException('Пользователь с таким email не найден', HttpStatus.NOT_FOUND);
            }
            const projects = await this.projectRepository.find({
                where: { userId: user.id, }, relations: ['lists', 'lists.tasks'],
            });
            return projects;
        } catch (error) {
            console.error('Не удалось получить проекты:', error.message);
            if (error instanceof HttpException) {
                throw error;
            }
            else {
                throw new HttpException('Возникла ошибка при получении проектов', HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }

    async getOneProject(id: number, req) {
        try {
            const email = req.user.email;
            let user = await this.userService.getUserByEmail(email);
            if (!user) {
                throw new HttpException('Пользователь с таким email не найден', HttpStatus.NOT_FOUND);
            }
            const project = await this.projectRepository.findOne({
                where: { userId: user.id, id }, relations: ['lists', 'lists.tasks']
            });
            if (project) {
                return project;
            }
            else {
                throw new HttpException('Проект с таким id не найден либо принадлежит другому пользователю', HttpStatus.NOT_FOUND);
            }
        } catch (error) {
            console.error('Не удалось получить проект:', error.message);
            if (error instanceof HttpException) {
                throw error;
            }
            else {
                throw new HttpException('Возникла ошибка при получении проекта', HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }
    async updateProject(id: number, updateData: createProjectDto, req) {
        try {
            const email = req.user.email;
            let user = await this.userService.getUserByEmail(email);
            if (!user) {
                throw new HttpException('Пользователь с таким email не найден', HttpStatus.NOT_FOUND);
            }
            const project = await this.projectRepository.findOne({
                where: { userId: user.id, id },
            });
            if (project) {
                this.projectRepository.merge(project, updateData);
                await this.projectRepository.save(project);
                return project;
            }
            else {
                throw new HttpException('Проект с таким id не найден либо принадлежит другому пользователю', HttpStatus.NOT_FOUND);
            }
        } catch (error) {
            console.error('Не удалось обновить проект:', error.message);
            if (error instanceof HttpException) {
                throw error;
            }
            else {
                throw new HttpException('Возникла ошибка при обновлении проекта', HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }
    async removeProject(id: number, req) {
        try {
            const email = req.user.email;
            let user = await this.userService.getUserByEmail(email);
            if (!user) {
                throw new HttpException('Пользователь с таким email не найден', HttpStatus.NOT_FOUND);
            }
            const changes = await this.projectRepository.delete({
                userId: user.id, id
            });
            if (changes.affected === 0) {
                return { message: "Такого проекта нет или он принадлежит другому пользователю" }
            } else {
                return { message: "Проект удалён" }
            }
        } catch (error) {
            console.error('Не удалось удалить проект:', error.message);
            if (error instanceof HttpException) {
                throw error;
            }
            else {
                throw new HttpException('Возникла ошибка при удалении проекта', HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }
}