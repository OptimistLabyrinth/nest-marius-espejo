import { OmitType } from '@nestjs/swagger';
import { Pet } from '../entities/pet.entity';

export class DeletePetDto extends OmitType(Pet, ['id']) {}
