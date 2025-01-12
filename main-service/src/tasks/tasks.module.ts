import { TypeOrmModule } from "@nestjs/typeorm";
import { TasksService } from "./tasks.service";
import { Module } from "@nestjs/common";
import { Project } from "src/projects/projects.entity";
import { Task } from "./tasks.entity";
import { List } from "src/lists/lists.entity";
import { TasksController } from "./tasks.controller";
import { AuthModule } from "src/auth/auth.module";
import { UsersModule } from "src/users/users.module";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { CacheModule } from "@nestjs/cache-manager";
import * as redisStore from "cache-manager-redis-store"

@Module({
    controllers: [TasksController],
    providers: [TasksService],
    imports: [
        CacheModule.register({
            store: redisStore,
            host: process.env.REDIS_CONTAINER_NAME,
            port: Number(process.env.REDIS_PORT),
          }),
        TypeOrmModule.forFeature([Project, List, Task]),
        AuthModule,
        UsersModule,
    ClientsModule.register([
        {
            name: 'FROM_MAIN_TO_USER',
            transport: Transport.RMQ,
            options: {
                urls: [`amqp://${process.env.RABBITMQ_LOGIN}:${process.env.RABBITMQ_PASSWORD}@${process.env.RABBITMQ_HOST}:${process.env.RABBITMQ_PORT}`],
                queue: process.env.RABBITMQ_QUEUE_NAME,
                queueOptions: {
                    durable: true,
                },
            },
        },
    ]),],
    exports: [
        TasksService,
    ]
})
export class TasksModule { }