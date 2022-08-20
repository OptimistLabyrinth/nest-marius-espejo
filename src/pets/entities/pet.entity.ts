import { ApiProperty } from '@nestjs/swagger';
import { PetType } from 'src/const/pet-const';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Pet {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty()
  @Column({ nullable: true, unsigned: true })
  age?: number;

  @ApiProperty()
  @Column({ unsigned: true })
  type: PetType;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @ManyToOne((type) => User, (user) => user.pets)
  owner: User;
}
