import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { DeleteUserDto } from './dto/delete-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { errorMessages } from './errorMessages';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const newUser = this.userRepository.create(createUserDto);
    return this.userRepository.save(newUser);
  }

  async findMany(name?: string): Promise<User[]> {
    if (name) {
      return this.userRepository.find({
        where: { name: Like(`%${name}%`) },
        relations: ['pets'],
      });
    }
    return this.userRepository.find({
      relations: ['pets'],
    });
  }

  async findById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['pets'],
    });
    if (!user) throw new NotFoundException(errorMessages.NOT_FOUND);
    return user;
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['pets'],
    });
    if (!user) throw new NotFoundException(errorMessages.NOT_FOUND);
    if (updateUserDto.name) user.name = updateUserDto.name;
    if (updateUserDto.age) user.age = updateUserDto.age;
    return this.userRepository.save(user);
  }

  async deleteUser(id: number): Promise<DeleteUserDto> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['pets'],
    });
    if (!user) throw new NotFoundException(errorMessages.NOT_FOUND);
    return this.userRepository.remove(user);
  }
}
