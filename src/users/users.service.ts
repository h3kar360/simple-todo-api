import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities/users.entity';
import { FindUserDto } from './dto/findUser.dto';
import { CreateUserDto } from './dto/createUser.dto';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USER_REPOSITORY')
    private userRepository: Repository<User>,
  ) {}

  async findUserByName(findUserDto: FindUserDto): Promise<User | null> {
    return this.userRepository.findOneBy({ username: findUserDto.username });
  }

  async createUser(createUserDto: CreateUserDto): Promise<User | null> {
    const user = this.userRepository.create({
      username: createUserDto.username,
      password: createUserDto.password,
    });

    return this.userRepository.save(user);
  }
}
