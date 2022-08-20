import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';
import { PetType } from 'src/const/pet-const';

export class CreatePetDto {
  @ApiProperty()
  @IsString()
  @MaxLength(255)
  name: string;

  @ApiProperty({ required: false, nullable: true })
  @IsOptional()
  @IsNumber()
  age?: number;

  @ApiProperty()
  @IsNumber()
  type: PetType;
}
