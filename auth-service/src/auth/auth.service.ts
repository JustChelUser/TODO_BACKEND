import { HttpException, HttpStatus, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { createUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs';
import { User } from 'src/users/users.entity';

@Injectable()
export class AuthService {

    constructor(private userService: UsersService, private jwtService: JwtService) { }

    async login(userDto: createUserDto) {
        const user = await this.validateUser(userDto);
        return this.generateToken(user);
    }


    async registration(userDto: createUserDto) {
        const candidate = await this.userService.getUserByEmail(userDto.email);
        if (candidate) {
            throw new HttpException('Пользователь с таким email существует', HttpStatus.BAD_REQUEST);
        }
        const hashPassword = await bcrypt.hash(userDto.password, 5);
        const user = await this.userService.createUser({ ...userDto, password: hashPassword });
        return this.generateToken(user);
    }

    private async generateToken(user: User) {
        const payload = { email: user.email };
        return {
            token: this.jwtService.sign(payload)
        }
    }

    private async validateUser(userDto: createUserDto) {
        const user = await this.userService.getUserByEmail(userDto.email);
        if (user !== null) {
            const passwordEquals = await bcrypt.compare(userDto.password, user.password);
            if (user && passwordEquals) {
                return user;
            }
        }
        throw new UnauthorizedException({ message: 'Некорректный email или пароль' });
    }
}

