import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Pet } from 'src/pets/entities/pet.entity';

@Entity()
export class User {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty()
  @Column({ nullable: true, unsigned: true })
  age?: number;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @OneToMany((type) => Pet, (pet) => pet.owner)
  pets: Pet[];
}
