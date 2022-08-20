import { OmitType } from '@nestjs/swagger';
import { User } from '../entities/user.entity';

export class DeleteUserDto extends OmitType(User, ['id']) {}
