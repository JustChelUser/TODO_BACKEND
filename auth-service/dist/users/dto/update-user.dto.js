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
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class updateUserDto {
}
exports.updateUserDto = updateUserDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'user@mail.ru', description: 'Почтовый адрес' }),
    (0, class_validator_1.IsString)({ message: 'Должно быть строкой' }),
    (0, class_validator_1.IsEmail)({}, { message: "Некорректный email" }),
    __metadata("design:type", String)
], updateUserDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '12345678', description: 'Пароль' }),
    (0, class_validator_1.IsString)({ message: 'Должно быть строкой' }),
    (0, class_validator_1.Length)(4, 255, { message: 'Не меньше 4 и не больше 255' }),
    __metadata("design:type", String)
], updateUserDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'false', description: 'Флаг администратора' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)({ message: 'Должно быть булевым значением' }),
    __metadata("design:type", Boolean)
], updateUserDto.prototype, "is_admin", void 0);
//# sourceMappingURL=update-user.dto.js.map