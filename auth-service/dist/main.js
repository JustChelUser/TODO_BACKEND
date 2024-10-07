"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
require("reflect-metadata");
const swagger_1 = require("@nestjs/swagger");
const validation_pipe_1 = require("./pipes/validation.pipe");
const microservices_1 = require("@nestjs/microservices");
async function start() {
    const PORT = process.env.PORT || 5000;
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const microservice = app.connectMicroservice({
        transport: microservices_1.Transport.RMQ,
        options: {
            urls: [`amqp://${process.env.RABBITMQ_LOGIN}:${process.env.RABBITMQ_PASSWORD}@${process.env.RABBITMQ_HOST}:${process.env.RABBITMQ_PORT}`],
            queue: process.env.RABBITMQ_QUEUE_NAME,
            queueOptions: {
                durable: true,
            },
        }
    });
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Пример backend части to-do листа')
        .setDescription('Документация REST API')
        .setVersion('1.0.0')
        .addTag('to-do list')
        .build();
    const Document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('/api/docs', app, Document);
    app.useGlobalPipes(new validation_pipe_1.ValidationPipe);
    await app.startAllMicroservices();
    await app.listen(PORT, () => console.log(`Servert started on port ${PORT}`));
}
start();
//# sourceMappingURL=main.js.map