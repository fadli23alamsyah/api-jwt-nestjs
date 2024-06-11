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

  async findOneByEmail(email: string): Promise<User | null> {
    const user = await this.userRepository.find({
      select: ['id', 'email', 'created_at', 'updated_at'],
      where: { email: email },
      take: 1,
    });

    return user[0];
  }

  async update(id: number, updateData: InputUserDto): Promise<UpdateResult> {
    return await this.userRepository.update({ id: id }, updateData);
  }
}
