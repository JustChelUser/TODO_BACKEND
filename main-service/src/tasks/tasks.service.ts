import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Task } from "./tasks.entity";
import { In, Repository } from "typeorm";
import { createTaskDto } from "./dto/create-task.dto";
import { List } from "src/lists/lists.entity";
import { updateTaskDto } from "./dto/update-task.dto";
import { changePositionTaskDto } from "./dto/change-position-task.dto";
import { UsersService } from "src/users/users.service";
import { Project } from "src/projects/projects.entity";

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(Task)
        private taskRepository: Repository<Task>,
        @InjectRepository(List)
        private listRepository: Repository<List>,
        @InjectRepository(Project)
        private projectRepository: Repository<Project>,
        private userService: UsersService
    ) { }
    async createTask(dto: createTaskDto, req) {
        try {
            const email = req.user.email;
            let user = await this.userService.getUserByEmail(email);
            if (!user) {
                throw new HttpException('Пользователь с таким email не найден', HttpStatus.NOT_FOUND);
            }
            const projects = await this.projectRepository.find({
                where: { userId: user.id },
            });
            const projectIds = projects.map(project => project.id);
            const list = await this.listRepository.findOne({ where: { project: In(projectIds), id: dto.listId } });
            if (list) {
                const countTasks = await this.taskRepository.count({
                    where: { list: { id: list.id } }
                });
                dto.position = countTasks + 1;
                const task = this.taskRepository.create({ ...dto, list });
                await this.taskRepository.save(task);
                return task;
            }
            else {
                throw new HttpException('Список задач с таким id не найден либо принадлежит другому пользователю', HttpStatus.NOT_FOUND);
            }
        } catch (error) {
            console.error('Не удалось создать задачу:', error.message);
            if (error instanceof HttpException) {
                throw error;
            }
            else {
                throw new HttpException('Возникла ошибка при попытке создания задачи', HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }

    async getAllTasks(req) {
        try {
            const email = req.user.email;
            let user = await this.userService.getUserByEmail(email);
            if (!user) {
                throw new HttpException('Пользователь с таким email не найден', HttpStatus.NOT_FOUND);
            }
            const projects = await this.projectRepository.find({
                where: { userId: user.id },
            });
            const projectIds = projects.map(project => project.id);
            const lists = await this.listRepository.find({ where: { project: In(projectIds) } });
            const listIds = lists.map(list => list.id);
            const tasks = await this.taskRepository.find({ where: { list: In(listIds) }, relations: ['list'] });
            return tasks;
        } catch (error) {
            console.error('Не удалось получить задачи:', error.message);
            if (error instanceof HttpException) {
                throw error;
            }
            else {
                throw new HttpException('Возникла ошибка при получении задач', HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }

    async getOneTask(id: number, req) {
        try {
            const email = req.user.email;
            let user = await this.userService.getUserByEmail(email);
            if (!user) {
                throw new HttpException('Пользователь с таким email не найден', HttpStatus.NOT_FOUND);
            }
            const projects = await this.projectRepository.find({
                where: { userId: user.id },
            });
            const projectIds = projects.map(project => project.id);
            const lists = await this.listRepository.find({ where: { project: In(projectIds) } });
            const listIds = lists.map(list => list.id);
            const task = await this.taskRepository.findOne({ where: { list: In(listIds), id }, relations: ['list'] });
            if (task) {
                return task;
            }
            else {
                throw new HttpException('Задача с таким id не найдена либо принадлежит другому пользователю', HttpStatus.NOT_FOUND);
            }
        } catch (error) {
            console.error('Не удалось получить задачи:', error.message);
            if (error instanceof HttpException) {
                throw error;
            }
            else {
                throw new HttpException('Возникла ошибка при получении задач', HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }
    async updateTask(id: number, updateData: updateTaskDto, req) {
        try {
            const email = req.user.email;
            let user = await this.userService.getUserByEmail(email);
            if (!user) {
                throw new HttpException('Пользователь с таким email не найден', HttpStatus.NOT_FOUND);
            }
            const projects = await this.projectRepository.find({
                where: { userId: user.id },
            });
            const projectIds = projects.map(project => project.id);
            const lists = await this.listRepository.find({ where: { project: In(projectIds) } });
            const listIds = lists.map(list => list.id);
            const task = await this.taskRepository.findOne({ where: { list: In(listIds), id }, relations: ['list'] });
            if (task) {
                this.taskRepository.merge(task, updateData);
                await this.taskRepository.save(task);
                return task;
            }
            else {
                throw new HttpException('Задача с таким id не найдена либо принадлежит другому пользователю', HttpStatus.NOT_FOUND);
            }
        } catch (error) {
            console.error('Не удалось обновить задачу:', error.message);
            if (error instanceof HttpException) {
                throw error;
            }
            else {
                throw new HttpException('Возникла ошибка при обновлении задачи', HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }
    async updateTaskPosition(id: number, updateData: changePositionTaskDto, req) {
        try {
            const email = req.user.email;
            let user = await this.userService.getUserByEmail(email);
            if (!user) {
                throw new HttpException('Пользователь с таким email не найден', HttpStatus.NOT_FOUND);
            }
            const projects = await this.projectRepository.find({
                where: { userId: user.id },
            });
            const projectIds = projects.map(project => project.id);
            const lists = await this.listRepository.find({ where: { project: In(projectIds) } });
            const listIds = lists.map(list => list.id);
            const task = await this.taskRepository.findOne({ where: { list: In(listIds), id }, relations: ['list'] });
            if (task) {
                const originalListId = task.list.id;
                const newListId = updateData.listId;
                if (originalListId !== newListId) {
                    const result = listIds.find(element => element === newListId);
                    if (!result) {
                        throw new HttpException('Список задач с таким id не найден либо принадлежит другому пользователю', HttpStatus.NOT_FOUND);
                    }
                }
                const countTasks = await this.taskRepository.count({
                    where: { list: { id: newListId } }
                });
                if (originalListId === newListId) {
                    return this.PositionInSameList(task, updateData, newListId, countTasks);
                }
                else {
                    //если пользователь поменял лист на другой
                    return this.PositionInOtherList(task, updateData, newListId, countTasks);
                }
            }
            else {
                throw new HttpException('Задача с таким id не найдена либо принадлежит другому пользователю', HttpStatus.NOT_FOUND);
            }
        }
        catch (error) {
            console.error('Не удалось обновить задачу:', error.message);
            if (error instanceof HttpException) {
                throw error;
            }
            else {
                throw new HttpException('Возникла ошибка при обновлении задачи', HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }
    async PositionInSameList(task: Task, updateData: changePositionTaskDto, newListId: number, countTasks: number) {
        try {
            if (updateData.position > countTasks) {
                updateData.position = countTasks;
            }
            if (updateData.position !== task.position) {
                let tasks = await this.taskRepository.find({ where: { list: { id: newListId } }, order: { position: 'ASC' } });
                const oldPosition = task.position;
                const newPosition = updateData.position ? updateData.position : task.position;
                if (newPosition < oldPosition) {
                    tasks.forEach((taskA) => {
                        if (taskA.id !== task.id && taskA.position >= newPosition && taskA.position < oldPosition) {
                            taskA.position++;
                        }
                    });
                } else {
                    tasks.forEach((taskA) => {
                        if (taskA.id !== task.id && taskA.position > oldPosition && taskA.position <= newPosition) {
                            taskA.position--;
                        }
                    });
                }
                task.position = newPosition;
                await this.taskRepository.save([...tasks, task]);
            }
            return task;
        }
        catch (error) {
            console.error('Не удалось обновить задачу:', error.message);
            if (error instanceof HttpException) {
                throw error;
            }
            else {
                throw new HttpException('Возникла ошибка при обновлении задачи', HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }
    async PositionInOtherList(task: Task, updateData: changePositionTaskDto, newListId: number, countTasks: number) {
        try {
            if (updateData.position > countTasks || !updateData.position) {
                updateData.position = countTasks + 1;
            }
            const deletedPosition = task.position;
            const changes = await this.taskRepository.delete(task.id);
            if (changes.affected === 0) {
                return { message: "Не удалось удалить задачу из изначального списка. Отмена всех изменений" }
            }
            else {
                let tasks = await this.taskRepository.find({ where: { list: { id: task.list.id } }, order: { position: 'ASC' } });
                if (tasks.length !== 0) {
                    tasks.forEach((taskA) => {
                        if (taskA.position > deletedPosition) {
                            taskA.position--;
                        }
                    });
                }
                await this.taskRepository.save(tasks);
                //добавляем в новый лист и пересчитываем его позиции
                let Newtasks = await this.taskRepository.find({ where: { list: { id: newListId } }, order: { position: 'ASC' } });
                const newPosition = updateData.position;
                Newtasks.forEach((taskA) => {
                    if (newPosition <= taskA.position) {
                        taskA.position++;
                    }
                });
                task.position = newPosition;
                task.list.id = updateData.listId;
                await this.taskRepository.save([...Newtasks, task]);
                return task;
            }
        }
        catch (error) {
            console.error('Не удалось обновить задачу:', error.message);
            if (error instanceof HttpException) {
                throw error;
            }
            else {
                throw new HttpException('Возникла ошибка при обновлении задачи', HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }
    async removeTask(id: number, req) {
        try {
            const email = req.user.email;
            let user = await this.userService.getUserByEmail(email);
            if (!user) {
                throw new HttpException('Пользователь с таким email не найден', HttpStatus.NOT_FOUND);
            }
            const projects = await this.projectRepository.find({
                where: { userId: user.id },
            });
            const projectIds = projects.map(project => project.id);
            const lists = await this.listRepository.find({ where: { project: In(projectIds) } });
            const listIds = lists.map(list => list.id);
            const task = await this.taskRepository.findOne({ where: { list: In(listIds), id }, relations: ['list'] });
            if (task) {
                const deletedPosition = task.position;
                const changes = await this.taskRepository.delete(task.id);
                if (changes.affected === 0) {
                    return { message: "Такой задачи нет или она принадлежит другому пользователю" }
                } else {
                    let tasks = await this.taskRepository.find({ where: { list: { id: task.list.id } }, order: { position: 'ASC' } });
                    if (tasks.length != 0) {
                        tasks.forEach((taskA) => {
                            if (taskA.position >= deletedPosition) {
                                taskA.position--;
                            }
                        });
                    }
                    await this.taskRepository.save(tasks);
                    return { message: "Задача удалёна" }
                }
            }
            else {
                throw new HttpException('Задача с таким id не найдена либо принадлежит другому пользователю', HttpStatus.NOT_FOUND);
            }
        } catch (error) {
            console.error('Не удалось удалить задачу:', error.message);
            if (error instanceof HttpException) {
                throw error;
            }
            else {
                throw new HttpException('Возникла ошибка при удалении задачи', HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }
}
