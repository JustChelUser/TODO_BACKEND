import { AuthService } from './auth.service';
import { createUserDto } from 'src/users/dto/create-user.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(userDto: createUserDto): Promise<{
        token: string;
    }>;
    registration(userDto: createUserDto): Promise<{
        token: string;
    }>;
}
