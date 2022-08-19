import { Injectable } from '@nestjs/common';
import { IdPoolService } from 'src/id-pool/id-pool.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  private users: User[];
  private idPoolService: IdPoolService;

  constructor(idPoolService: IdPoolService) {
    this.idPoolService = idPoolService;
    this.users = [
      {
        id: 1234,
        name: 'Marius',
      },
      {
        id: 1200,
        name: 'Marius',
      },
      {
        id: 4567,
        name: 'Jason',
      },
      {
        id: 7890,
        name: 'Titus',
      },
    ];
  }

  findAll(name?: string): User[] {
    if (name) {
      return this.users.filter((user) => user.name === name);
    }
    return this.users;
  }

  findById(userId: number): User | null {
    return this.users.find((user) => user.id === userId);
  }

  createUser(createUserDto: CreateUserDto): User {
    const newUser: User = {
      id: this.idPoolService.getRandomInt(),
      ...createUserDto,
    };
    this.users.push(newUser);
    return newUser;
  }
}
