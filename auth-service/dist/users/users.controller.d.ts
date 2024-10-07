import { UsersService } from "./users.service";
import { User } from "./users.entity";
import { createUserDto } from "./dto/create-user.dto";
import { updateUserDto } from "./dto/update-user.dto";
export declare class UsersController {
    private userService;
    constructor(userService: UsersService);
    createProject(userDto: createUserDto, req: any): Promise<{
        token: string;
    }>;
    getAllProjects(req: any): Promise<User[]>;
    getOneProject(id: number, req: any): Promise<User>;
    updateProject(updateUser: updateUserDto, id: number, req: any): Promise<User>;
    deleteProject(id: number, req: any): Promise<{
        message: string;
    }>;
    getUserByEmail(email: string): Promise<User>;
}
