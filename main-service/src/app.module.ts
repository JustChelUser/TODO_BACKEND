import { Module } from "@nestjs/common";
import { ConfigModule} from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Project } from "./projects/projects.entity";
import { List } from "./lists/lists.entity";
import { ListsModule } from "./lists/lists.module";
import { TasksModule } from "./tasks/tasks.module";
import { ProjectsModule } from "./projects/projects.module";
import { Task } from "./tasks/tasks.entity";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";


@Module({
  controllers: [],
  providers: [],
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env`
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      entities: [Project, List, Task],
      synchronize: true,
      autoLoadEntities: true
    }),
    ProjectsModule,
    ListsModule,
    TasksModule,
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
    ]),
  ],
})
export class AppModule { }