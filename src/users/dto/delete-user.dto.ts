import { ApiProperty } from '@nestjs/swagger';

export class DeleteUserDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  age?: number;
}
