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
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const users_service_1 = require("./users.service");
const users_entity_1 = require("./users.entity");
const create_user_dto_1 = require("./dto/create-user.dto");
const update_user_dto_1 = require("./dto/update-user.dto");
const microservices_1 = require("@nestjs/microservices");
(0, common_1.Injectable)();
let UsersController = class UsersController {
    constructor(userService) {
        this.userService = userService;
    }
    createProject(userDto, req) {
        return this.userService.createUserManualy(userDto, req);
    }
    getAllProjects(req) {
        return this.userService.getAllUsers(req);
    }
    getOneProject(id, req) {
        return this.userService.getOneUser(id, req);
    }
    updateProject(updateUser, id, req) {
        return this.userService.updateUser(id, updateUser, req);
    }
    deleteProject(id, req) {
        return this.userService.removeUser(id, req);
    }
    async getUserByEmail(email) {
        try {
            const response = await this.userService.getUserByEmail(email);
            return response;
        }
        catch (error) {
            console.error('Не удалось получить пользователя по email:', error.message);
            throw new microservices_1.RpcException('Ошибка при получении данных');
        }
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Создание пользователя' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: users_entity_1.User }),
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.createUserDto, Object]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "createProject", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Получить всех польователей' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: [users_entity_1.User] }),
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "getAllProjects", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Получить одного пользователя' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: users_entity_1.User }),
    (0, common_1.Get)('/:value'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('value')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "getOneProject", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Обновить пользователя' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: users_entity_1.User }),
    (0, common_1.Put)('/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_user_dto_1.updateUserDto, Number, Object]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "updateProject", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Удалить пользователя' }),
    (0, swagger_1.ApiResponse)({ status: 200 }),
    (0, common_1.Delete)('/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "deleteProject", null);
__decorate([
    (0, microservices_1.MessagePattern)({ cmd: 'getUserByEmail' }),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getUserByEmail", null);
exports.UsersController = UsersController = __decorate([
    (0, swagger_1.ApiTags)('Пользователи'),
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
//# sourceMappingURL=users.controller.js.map