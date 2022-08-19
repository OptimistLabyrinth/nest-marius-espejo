import { ApiProperty } from '@nestjs/swagger';
import {
  IsAlphanumeric,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @IsAlphanumeric()
  @MaxLength(10)
  name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  age?: number;
}
