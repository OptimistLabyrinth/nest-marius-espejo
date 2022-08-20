import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Pet } from 'src/pets/entities/pet.entity';

@Entity()
export class User {
  @ApiProperty()
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty({ nullable: true })
  @Column({ nullable: true, unsigned: true })
  age: number;

  @OneToMany(() => Pet, (pet) => pet.owner, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  pets: Pet[];
}
