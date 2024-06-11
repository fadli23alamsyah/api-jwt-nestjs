import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { InputUserDto } from './dto/input-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createData: InputUserDto): Promise<User> {
    return await this.userRepository.save(createData);
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOneBy({ email: email });
  }

  async update(id: number, updateData: InputUserDto): Promise<UpdateResult> {
    return await this.userRepository.update({ id: id }, updateData);
  }
}
