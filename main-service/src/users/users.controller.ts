import { Controller, Injectable } from "@nestjs/common";
import { UsersService } from "./users.service";
import { Ctx, EventPattern, Payload, RmqContext } from "@nestjs/microservices";

Injectable()
@Controller()
export class UsersController {

    constructor(private userService: UsersService) { }
    @EventPattern('removeUserObjets')
    async removeUserObjects(@Payload() userId: number, @Ctx() context: RmqContext) {
        try {
            await this.userService.removeUserObjets(userId);
        }
        catch (error) {
            console.error('Ошибка при удалении объектов пользователя:', error);
        }
    }
}
