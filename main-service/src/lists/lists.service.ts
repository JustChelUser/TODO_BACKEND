import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { List } from "./lists.entity";
import { In, Repository } from "typeorm";
import { createListDto } from "./dto/create-list.dto";
import { Project } from "src/projects/projects.entity";
import { updateListDto } from "./dto/update-list.dto";
import { ChangePositionListDto } from "./dto/change-position-list.dto";
import { UsersService } from "src/users/users.service";

@Injectable()
export class ListsService {
    constructor(
        @InjectRepository(List)
        private listRepository: Repository<List>,
        @InjectRepository(Project)
        private projectRepository: Repository<Project>,
        private userService: UsersService
    ) { }
    async createList(dto: createListDto, req) {
        try {
            const email = req.user.email;
            let user = await this.userService.getUserByEmail(email);
            if (!user) {
                throw new HttpException('Пользователь с таким email не найден', HttpStatus.NOT_FOUND);
            }
            const project = await this.projectRepository.findOne({
                where: { userId: user.id, id: dto.projectId },
            });
            if (project) {
                const countLists = await this.listRepository.count({
                    where: { project: { id: project.id } }
                });
                dto.position = countLists + 1;
                const list = this.listRepository.create({ ...dto, project });
                await this.listRepository.save(list);
                return list;
            }
            else {
                throw new HttpException('Проект с таким id не найден либо принадлежит другому пользователю', HttpStatus.NOT_FOUND);
            }
        } catch (error) {
            console.error('Не удалось создать список задач:', error.message);
            if (error instanceof HttpException) {
                throw error;
            }
            else {
                throw new HttpException('Возникла ошибка при попытке создания списка задач', HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }

    async getAllLists(req) {
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
            const lists = await this.listRepository.find({ where: { project: In(projectIds) }, relations: ['tasks'] });
            return lists;
        } catch (error) {
            console.error('Не удалось получить листы задач:', error.message);
            if (error instanceof HttpException) {
                throw error;
            }
            else {
                throw new HttpException('Возникла ошибка при получении листов задач', HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }

    async getOneList(id: number, req) {
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
            const list = await this.listRepository.findOne({ where: { project: In(projectIds), id }, relations: ['tasks'] });
            if (list) {
                return list;
            }
            else {
                throw new HttpException('Лист задач с таким id не найден либо принадлежит другому пользователю', HttpStatus.NOT_FOUND);
            }
        } catch (error) {
            console.error('Не удалось получить лист задач:', error.message);
            if (error instanceof HttpException) {
                throw error;
            }
            else {
                throw new HttpException('Возникла ошибка при получении листа задач', HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }
    async updateList(id: number, updateData: updateListDto, req) {
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
            const list = await this.listRepository.findOne({ where: { project: In(projectIds), id }, relations: ['tasks'] });
            if (list) {
                this.listRepository.merge(list, updateData);
                await this.listRepository.save(list);
                return list;
            }
            else {
                throw new HttpException('Лист задач с таким id не найден либо принадлежит другому пользователю', HttpStatus.NOT_FOUND);
            }
        } catch (error) {
            console.error('Не удалось обновить лист задач:', error.message);
            if (error instanceof HttpException) {
                throw error;
            }
            else {
                throw new HttpException('Возникла ошибка при обновлении листа задач', HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }
    async updateListPosition(id: number, updateData: ChangePositionListDto, req) {
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
            const list = await this.listRepository.findOne({ where: { project: In(projectIds), id }, relations: ['tasks', 'project'] });
            if (list) {
                const countLists = await this.listRepository.count({
                    where: { project: { id: list.project.id } }
                });
                if (updateData.position <= countLists) {
                    if (updateData.position !== list.position) {
                        let lists = await this.listRepository.find({ where: { project: { id: list.project.id } }, order: { position: 'ASC' } });
                        const oldPosition = list.position;
                        const newPosition = updateData.position;
                        if (newPosition < oldPosition) {
                            lists.forEach((listA) => {
                                if (listA.id !== list.id && listA.position >= newPosition && listA.position < oldPosition) {
                                    listA.position++;
                                }
                            });
                        } else {
                            lists.forEach((listA) => {
                                if (listA.id !== list.id && listA.position > oldPosition && listA.position <= newPosition) {
                                    listA.position--;
                                }
                            });
                        }
                        list.position = newPosition;
                        await this.listRepository.save([...lists, list]);
                    }
                    return list;
                } else {
                    throw new HttpException(`Новая позиция не может быть больше общего количества списков на данный момент. Всего списков ${countLists}. Запрашиваемая позиция ${updateData.position}`, HttpStatus.NOT_FOUND);
                }
            }
            else {
                throw new HttpException('Лист задач с таким id не найден либо принадлежит другому пользователю', HttpStatus.NOT_FOUND);
            }
        } catch (error) {
            console.error('Не удалось обновить лист задач:', error.message);
            if (error instanceof HttpException) {
                throw error;
            }
            else {
                throw new HttpException('Возникла ошибка при обновлении листа задач', HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }
    async removeList(id: number, req) {
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
            const list = await this.listRepository.findOne({ where: { project: In(projectIds), id }, relations: ['tasks', 'project'] });
            if (list) {
                const deletedPosition = list.position;
                const changes = await this.listRepository.delete(list.id);
                if (changes.affected === 0) {
                    return { message: "Не удалось удалить список задач. Попробуйте ещё раз" }
                } else {
                    let lists = await this.listRepository.find({ where: { project: { id: list.project.id } }, order: { position: 'ASC' } });
                    if (lists.length != 0) {
                        lists.forEach((listA) => {
                            if (listA.position >= deletedPosition) {
                                listA.position--;
                            }
                        });
                    }
                    await this.listRepository.save(lists);
                    return { message: "Список задач удалён" }
                }
            }
            else {
                throw new HttpException('Лист задач с таким id не найден либо принадлежит другому пользователю', HttpStatus.NOT_FOUND);
            }
        } catch (error) {
            console.error('Не удалось удалить список задач:', error.message);
            if (error instanceof HttpException) {
                throw error;
            }
            else {
                throw new HttpException('Возникла ошибка при удалении списка задач', HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }
}