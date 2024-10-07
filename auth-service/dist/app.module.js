"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const users_entity_1 = require("./users/users.entity");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const microservices_1 = require("@nestjs/microservices");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        controllers: [],
        providers: [],
        imports: [
            config_1.ConfigModule.forRoot({
                envFilePath: `.env`
            }),
            typeorm_1.TypeOrmModule.forRoot({
                type: 'postgres',
                host: process.env.POSTGRES_HOST,
                port: Number(process.env.POSTGRES_PORT),
                username: process.env.POSTGRES_USER,
                password: process.env.POSTGRES_PASSWORD,
                database: process.env.POSTGRES_DB,
                entities: [users_entity_1.User],
                synchronize: true,
                autoLoadEntities: true
            }),
            users_module_1.UsersModule,
            auth_module_1.AuthModule,
            microservices_1.ClientsModule.register([
                {
                    name: 'FROM_MAIN_TO_USER',
                    transport: microservices_1.Transport.RMQ,
                    options: {
                        urls: [`amqp://${process.env.RABBITMQ_LOGIN}:${process.env.RABBITMQ_PASSWORD}@${process.env.RABBITMQ_HOST}:${process.env.RABBITMQ_PORT}`],
                        queue: process.env.RABBITMQ_QUEUE_NAME,
                        queueOptions: {
                            durable: true,
                        },
                    },
                },
            ]),
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
    })
], AppModule);
//# sourceMappingURL=app.module.js.map