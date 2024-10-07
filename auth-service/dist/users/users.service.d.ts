import { Repository } from "typeorm/repository/Repository";
import { User } from "./users.entity";
import { createUserDto } from "./dto/create-user.dto";
import { updateUserDto } from "./dto/update-user.dto";
import { AuthService } from "src/auth/auth.service";
import { ClientProxy } from "@nestjs/microservices";
export declare class UsersService {
    private userRepository;
    private authService;
    private clientUser;
    constructor(userRepository: Repository<User>, authService: AuthService, clientUser: ClientProxy);
    createUser(dto: createUserDto): Promise<User>;
    createUserManualy(dto: createUserDto, req: any): Promise<{
        token: string;
    }>;
    getAllUsers(req: any): Promise<User[]>;
    getOneUser(id: number, req: any): Promise<User>;
    updateUser(id: number, updateUser: updateUserDto, req: any): Promise<User>;
    removeUser(id: number, req: any): Promise<{
        message: string;
    }>;
    getUserByEmail(email: string): Promise<User>;
    removeUserObjects(id: number): Promise<void>;
}
