import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { InjectRepository } from "@nestjs/typeorm";
import { firstValueFrom, timeout } from "rxjs";
import { Project } from "src/projects/projects.entity";
import { Repository } from "typeorm";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(Project)
        private projectRepository: Repository<Project>,
        @Inject('FROM_MAIN_TO_USER') private clientMain: ClientProxy) { }
    async getUserByEmail(email: string) {
        try {
            const response = await firstValueFrom(
                this.clientMain.send({ cmd: 'getUserByEmail' }, email).pipe(timeout(5000)),
            )
            return response;
        } catch (error) {
            console.error('Ошибка при получении пользователя по email:', error);
        }
    }
    async removeUserObjects(userId: number) {
        try {
            const changes = await this.projectRepository.delete({
                userId: userId
            });
        } catch (error) {
            console.error('Не удалось удалить объекты пользователя:', error.message);
        }
    }

}
