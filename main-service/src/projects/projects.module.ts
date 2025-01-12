import { TypeOrmModule } from "@nestjs/typeorm";
import { Project } from "./projects.entity";
import { ProjectsService } from "./projects.service";
import { forwardRef, Module,  } from "@nestjs/common";
import { List } from "src/lists/lists.entity";
import { ProjectsController } from "./projects.controller";
import { AuthModule } from "src/auth/auth.module";
import { UsersModule } from "src/users/users.module";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { CacheModule } from "@nestjs/cache-manager";
import * as redisStore from "cache-manager-redis-store"

@Module({
  controllers: [ProjectsController],
  providers: [ProjectsService],
  imports: [
    CacheModule.register({
      store: redisStore,
      host: process.env.REDIS_CONTAINER_NAME,
      port: Number(process.env.REDIS_PORT),
    }),
    TypeOrmModule.forFeature([Project, List]),
    AuthModule,
    forwardRef(() => UsersModule),
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
    ]),
  ],
  exports: [
    ProjectsService,
  ]
})
export class ProjectsModule { }