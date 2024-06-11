import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Put,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserService } from './user.service';
import { User } from './user.entity';
import { DataResponse } from 'src/config/interfaces/response.interface';
import { InputUserDto } from './dto/input-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':email')
  async getByEmail(@Param('email') email: string): Promise<DataResponse<User>> {
    const data = await this.userService.findOneByEmail(email);

    if (!data) throw new HttpException('Data Not Found', HttpStatus.NOT_FOUND);
    return {
      message: 'Data Found',
      data: data,
    };
  }

  @Put(':email')
  async updateData(
    @Param('email') email: string,
    @Body() updateData: InputUserDto,
  ): Promise<DataResponse<User>> {
    if (!updateData.email && !updateData.password)
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);

    const user = await this.userService.findOneByEmail(email);
    if (!user) throw new HttpException('Data Not Found', HttpStatus.NOT_FOUND);

    if (updateData.password) {
      const salt = bcrypt.genSaltSync(10);
      updateData = {
        ...updateData,
        password: bcrypt.hashSync(updateData.password, salt),
      };
    }

    const responseDB = await this.userService.update(user.id, updateData);
    if (responseDB.affected == 0) {
      throw new HttpException('Email already exists', HttpStatus.BAD_REQUEST);
    }
    return {
      message: 'Updated successfully',
    };
  }
}
