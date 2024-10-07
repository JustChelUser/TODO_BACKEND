"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersModule = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("./users.service");
const typeorm_1 = require("@nestjs/typeorm");
const users_entity_1 = require("./users.entity");
const auth_module_1 = require("../auth/auth.module");
const users_controller_1 = require("./users.controller");
const microservices_1 = require("@nestjs/microservices");
const config_1 = require("@nestjs/config");
let UsersModule = class UsersModule {
};
exports.UsersModule = UsersModule;
exports.UsersModule = UsersModule = __decorate([
    (0, common_1.Module)({
        controllers: [users_controller_1.UsersController],
        providers: [users_service_1.UsersService],
        imports: [
            config_1.ConfigModule.forRoot({
                envFilePath: `.env`
            }),
            typeorm_1.TypeOrmModule.forFeature([users_entity_1.User]),
            (0, common_1.forwardRef)(() => auth_module_1.AuthModule),
            microservices_1.ClientsModule.register([
                {
                    name: 'FROM_USER_TO_MAIN',
                    transport: microservices_1.Transport.RMQ,
                    options: {
                        urls: [`amqp://${process.env.RABBITMQ_LOGIN}:${process.env.RABBITMQ_PASSWORD}@${process.env.RABBITMQ_HOST}:${process.env.RABBITMQ_PORT}`],
                        queue: process.env.RABBITMQ_QUEUE2_NAME,
                        queueOptions: {
                            durable: true,
                        },
                    },
                },
            ])
        ],
        exports: [
            users_service_1.UsersService,
        ]
    })
], UsersModule);
//# sourceMappingURL=users.module.js.map