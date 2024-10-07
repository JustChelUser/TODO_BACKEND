"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const Repository_1 = require("typeorm/repository/Repository");
const users_entity_1 = require("./users.entity");
const typeorm_1 = require("@nestjs/typeorm");
const auth_service_1 = require("../auth/auth.service");
const bcrypt = require("bcryptjs");
const microservices_1 = require("@nestjs/microservices");
let UsersService = class UsersService {
    constructor(userRepository, authService, clientUser) {
        this.userRepository = userRepository;
        this.authService = authService;
        this.clientUser = clientUser;
    }
    async createUser(dto) {
        try {
            const user = this.userRepository.create(dto);
            await this.userRepository.save(user);
            return user;
        }
        catch (error) {
            console.error('Не удалось создать пользователя:', error.message);
            throw new common_1.HttpException('Создать пользователя не удалось', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async createUserManualy(dto, req) {
        try {
            const email = req.user.email;
            const user = await this.userRepository.findOne({ where: { email, is_admin: true } });
            if (user) {
                return await this.authService.registration(dto);
            }
            else {
                throw new common_1.HttpException('Администратор с таким email не найден', common_1.HttpStatus.NOT_FOUND);
            }
        }
        catch (error) {
            console.error('Не удалось создать пользователя:', error.message);
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            else {
                throw new common_1.HttpException('Возникла ошибка при создании пользователя', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
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
            }
            else {
                throw new common_1.HttpException('Администратор с таким email не найден', common_1.HttpStatus.NOT_FOUND);
            }
        }
        catch (error) {
            console.error('Не удалось получить пользователей:', error.message);
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            else {
                throw new common_1.HttpException('Возникла ошибка при получении пользователей', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }
    async getOneUser(id, req) {
        try {
            const email = req.user.email;
            const user = await this.userRepository.findOne({ where: { email, is_admin: true } });
            if (user) {
                const user = await this.userRepository.findOne({ where: { id } });
                return user;
            }
            else {
                throw new common_1.HttpException('Администратор с таким email не найден', common_1.HttpStatus.NOT_FOUND);
            }
        }
        catch (error) {
            console.error('Не удалось получить пользователя:', error.message);
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            else {
                throw new common_1.HttpException('Возникла ошибка при получении пользователя', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }
    async updateUser(id, updateUser, req) {
        try {
            const email = req.user.email;
            const user = await this.userRepository.findOne({ where: { email, is_admin: true } });
            if (user) {
                const userUpdate = await this.userRepository.findOne({ where: { id } });
                if (userUpdate) {
                    const emailCheck = await this.getUserByEmail(updateUser.email);
                    if (emailCheck && userUpdate.id !== emailCheck.id) {
                        throw new common_1.HttpException('Пользователь с таким email существует', common_1.HttpStatus.BAD_REQUEST);
                    }
                    const hashPassword = await bcrypt.hash(updateUser.password, 5);
                    updateUser.password = hashPassword;
                    this.userRepository.merge(userUpdate, updateUser);
                    await this.userRepository.save(userUpdate);
                    return userUpdate;
                }
                else {
                    throw new common_1.HttpException('Пользователь с таким id не найден', common_1.HttpStatus.NOT_FOUND);
                }
            }
            else {
                throw new common_1.HttpException('Администратор с таким email не найден', common_1.HttpStatus.NOT_FOUND);
            }
        }
        catch (error) {
            console.error('Не удалось обновить данные пользователя:', error.message);
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            else {
                throw new common_1.HttpException('Возникла ошибка при обновлении данных пользователя', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }
    async removeUser(id, req) {
        try {
            const email = req.user.email;
            const user = await this.userRepository.findOne({ where: { email, is_admin: true } });
            if (user) {
                const changes = await this.userRepository.delete({ id });
                if (changes.affected === 0) {
                    return { message: "Пользователь не удалён" };
                }
                else {
                    await this.removeUserObjects(id);
                    return { message: "Пользователь удалён" };
                }
            }
            else {
                throw new common_1.HttpException('Администратор с таким email не найден', common_1.HttpStatus.NOT_FOUND);
            }
        }
        catch (error) {
            console.error('Не удалось удалить пользователя:', error.message);
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            else {
                throw new common_1.HttpException('Возникла ошибка при удалении пользователя', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }
    async getUserByEmail(email) {
        try {
            const user = await this.userRepository.findOne({ where: { email } });
            return user;
        }
        catch (error) {
            console.error('Не удалось найти пользователя по email:', error.message);
        }
    }
    async removeUserObjects(id) {
        try {
            this.clientUser.emit('removeUserObjets', id);
        }
        catch (error) {
            console.error('Ошибка при отправке сообщения о необходимости удаления объектов пользователя:', error);
        }
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(users_entity_1.User)),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => auth_service_1.AuthService))),
    __param(2, (0, common_1.Inject)('FROM_USER_TO_MAIN')),
    __metadata("design:paramtypes", [Repository_1.Repository,
        auth_service_1.AuthService,
        microservices_1.ClientProxy])
], UsersService);
//# sourceMappingURL=users.service.js.map