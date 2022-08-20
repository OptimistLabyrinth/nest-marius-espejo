import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { CreatePetDto } from './dto/create-pet.dto';
import { DeletePetDto } from './dto/delete-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { Pet } from './entities/pet.entity';
import { errorMessages } from './errorMessages';

@Injectable()
export class PetsService {
  constructor(@InjectRepository(Pet) private petRepository: Repository<Pet>) {}

  async create(createPetDto: CreatePetDto): Promise<Pet> {
    const newUser = this.petRepository.create(createPetDto);
    return this.petRepository.save(newUser);
  }

  findMany(name?: string): Promise<Pet[]> {
    if (name) {
      return this.petRepository.find({
        where: { name: Like(`%${name}%`) },
        relations: ['owner'],
      });
    }
    return this.petRepository.find({
      relations: ['owner'],
    });
  }

  async findOneById(id: number): Promise<Pet> {
    const pet = await this.petRepository.findOne({
      where: { id },
      relations: ['owner'],
    });
    if (!pet) throw new NotFoundException(errorMessages.NOT_FOUND);
    return pet;
  }

  async update(id: number, updatePetDto: UpdatePetDto): Promise<Pet> {
    const pet = await this.petRepository.findOne({
      where: { id },
      relations: ['owner'],
    });
    if (!pet) throw new NotFoundException(errorMessages.NOT_FOUND);
    if (updatePetDto.name) pet.name = updatePetDto.name;
    if (updatePetDto.age) pet.age = updatePetDto.age;
    if (updatePetDto.type) pet.type = updatePetDto.type;
    return this.petRepository.save(pet);
  }

  async remove(id: number): Promise<DeletePetDto> {
    const pet = await this.petRepository.findOne({
      where: { id },
      relations: ['owner'],
    });
    if (!pet) throw new NotFoundException(errorMessages.NOT_FOUND);
    return this.petRepository.remove(pet);
  }
}
