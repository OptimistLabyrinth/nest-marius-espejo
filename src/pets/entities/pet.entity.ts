import { ApiProperty } from '@nestjs/swagger';
import { PetType } from 'src/const/pet-const';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Pet {
  @ApiProperty()
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty({ nullable: true })
  @Column({ nullable: true, unsigned: true })
  age: number;

  @ApiProperty()
  @Column({ unsigned: true })
  type: PetType;

  @ManyToOne(() => User, (user) => user.pets, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  owner: User;
}
