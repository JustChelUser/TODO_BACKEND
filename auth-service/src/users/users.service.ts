import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { Repository } from "typeorm/repository/Repository";
import { User } from "./users.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { createUserDto } from "./dto/create-user.dto";
import { updateUserDto } from "./dto/update-user.dto";
import { AuthService } from "src/auth/auth.service";
import * as bcrypt from 'bcryptjs';
import { ClientProxy } from "@nestjs/microservices";


@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        @Inject(forwardRef(() => AuthService)) private authService: AuthService,
        @Inject('FROM_USER_TO_MAIN') private clientUser: ClientProxy
    ) { }

    async createUser(dto: createUserDto) {
        try {
            const user = this.userRepository.create(dto);
            await this.userRepository.save(user);
            return user;
        } catch (error) {
            console.error('Не удалось создать пользователя:', error.message);
            throw new HttpException('Создать пользователя не удалось', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async createUserManualy(dto: createUserDto, req) {
        try {
            const email = req.user.email;
            const user = await this.userRepository.findOne({ where: { email, is_admin: true } });
            if (user) {
                return await this.authService.registration(dto);
            } else {
                throw new HttpException('Администратор с таким email не найден', HttpStatus.NOT_FOUND);
            }
        } catch (error) {
            console.error('Не удалось создать пользователя:', error.message);
            if (error instanceof HttpException) {
                throw error;
            }
            else {
                throw new HttpException('Возникла ошибка при создании пользователя', HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }

    async getAllUsers(req) {
        try {
            const email = req.user.email;
            const user = await this.userRepository.findOne({ where: { email, is_admin: true } });
            if (user) {
                const users = await this.userRepository.find();
                return users;
            } else {
                throw new HttpException('Администратор с таким email не найден', HttpStatus.NOT_FOUND);
            }
        } catch (error) {
            console.error('Не удалось получить пользователей:', error.message);
            if (error instanceof HttpException) {
                throw error;
            }
            else {
                throw new HttpException('Возникла ошибка при получении пользователей', HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }

    async getOneUser(id: number, req) {
        try {
            const email = req.user.email;
            const user = await this.userRepository.findOne({ where: { email, is_admin: true } });
            if (user) {
                const user = await this.userRepository.findOne({ where: { id } });
                return user;
            } else {
                throw new HttpException('Администратор с таким email не найден', HttpStatus.NOT_FOUND);
            }
        } catch (error) {
            console.error('Не удалось получить пользователя:', error.message);
            if (error instanceof HttpException) {
                throw error;
            }
            else {
                throw new HttpException('Возникла ошибка при получении пользователя', HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }
    async updateUser(id: number, updateUser: updateUserDto, req) {
        try {
            const email = req.user.email;
            const user = await this.userRepository.findOne({ where: { email, is_admin: true } });
            if (user) {
                const userUpdate = await this.userRepository.findOne({ where: { id } });
                if (userUpdate) {
                    const emailCheck = await this.getUserByEmail(updateUser.email);
                    if (emailCheck && userUpdate.id !== emailCheck.id) {
                        throw new HttpException('Пользователь с таким email существует', HttpStatus.BAD_REQUEST);
                    }
                    const hashPassword = await bcrypt.hash(updateUser.password, 5);
                    updateUser.password = hashPassword;
                    this.userRepository.merge(userUpdate, updateUser);
                    await this.userRepository.save(userUpdate);
                    return userUpdate;
                }
                else {
                    throw new HttpException('Пользователь с таким id не найден', HttpStatus.NOT_FOUND);
                }
            } else {
                throw new HttpException('Администратор с таким email не найден', HttpStatus.NOT_FOUND);
            }
        } catch (error) {
            console.error('Не удалось обновить данные пользователя:', error.message);
            if (error instanceof HttpException) {
                throw error;
            }
            else {
                throw new HttpException('Возникла ошибка при обновлении данных пользователя', HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }
    async removeUser(id: number, req) {
        try {
            const email = req.user.email;
            const user = await this.userRepository.findOne({ where: { email, is_admin: true } });
            if (user) {
                const changes = await this.userRepository.delete({ id });
                if (changes.affected === 0) {
                    return { message: "Пользователь не удалён" }
                } else {
                    await this.removeUserObjects(id);
                    return { message: "Пользователь удалён" }
                }
            } else {
                throw new HttpException('Администратор с таким email не найден', HttpStatus.NOT_FOUND);
            }
        } catch (error) {
            console.error('Не удалось удалить пользователя:', error.message);
            if (error instanceof HttpException) {
                throw error;
            }
            else {
                throw new HttpException('Возникла ошибка при удалении пользователя', HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }
    async getUserByEmail(email: string) {
        try {
            const user = await this.userRepository.findOne({ where: { email } })
            return user;
        } catch (error) {
            console.error('Не удалось найти пользователя по email:', error.message);
        }
    }
    async removeUserObjects(id: number) {
        try {
            this.clientUser.emit('removeUserObjets', id);
        } catch (error) {
            console.error('Ошибка при отправке сообщения о необходимости удаления объектов пользователя:', error);
        }
    }
}