import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { createUserDto } from 'src/users/dto/create-user.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';

@ApiTags('Авторизация')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }


    @ApiOperation({ summary: 'Авторизация' })
    @ApiResponse({ status: 200, type: String })
    @UseGuards(LocalAuthGuard)
    @Post('/login')
    login(@Body() userDto: createUserDto) {
        return this.authService.login(userDto);
    }


    @ApiOperation({ summary: 'Регистрация' })
    @ApiResponse({ status: 200, type: String })
    @Post('/registration')
    registration(@Body() userDto: createUserDto) {
        return this.authService.registration(userDto);
    }
}

