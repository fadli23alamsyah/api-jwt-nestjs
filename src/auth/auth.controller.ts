import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { DataResponse } from 'src/config/interfaces/response.interface';
import { InputUserDto } from 'src/user/dto/input-user.dto';
import { UserService } from 'src/user/user.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

  @Post('register')
  async register(
    @Body() registerData: InputUserDto,
  ): Promise<DataResponse<string>> {
    if (!registerData.email || !registerData.password)
      throw new HttpException(
        'Make sure the email and password are not empty',
        HttpStatus.BAD_REQUEST,
      );

    const available = await this.userService.findOneByEmail(registerData.email);
    if (available)
      throw new HttpException(
        'Registration failed, email has been registered',
        HttpStatus.BAD_REQUEST,
      );

    const salt = bcrypt.genSaltSync(10);
    registerData = {
      ...registerData,
      password: bcrypt.hashSync(registerData.password, salt),
    };

    const user = await this.userService.create(registerData);
    if (!user)
      throw new HttpException(
        "Can't registered",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );

    return {
      message: 'Registered successfully',
    };
  }

  @Post('login')
  @HttpCode(200)
  async login(
    @Body()
    loginData: InputUserDto,
  ): Promise<DataResponse<object>> {
    if (!loginData.email || !loginData.password)
      throw new HttpException(
        'Make sure the email and password are not empty',
        HttpStatus.BAD_REQUEST,
      );

    const user = await this.userService.findOneByEmail(loginData.email);
    if (!user)
      throw new HttpException(
        'Login failed, email not registered',
        HttpStatus.BAD_REQUEST,
      );

    const validPassword = bcrypt.compareSync(loginData.password, user.password);
    if (!validPassword)
      throw new HttpException(
        'Login failed, password do not match',
        HttpStatus.BAD_REQUEST,
      );

    const payload = { id: user.id, email: user.email };

    return {
      message: 'Login successfully',
      data: {
        token: await this.jwtService.signAsync(payload),
      },
    };
  }
}
