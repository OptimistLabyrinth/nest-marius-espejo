import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { petTypeEnum } from 'src/const/pet-const';
import { CreatePetDto } from '../dto/create-pet.dto';

@Injectable()
export class PetTypeValidationPipe implements PipeTransform<CreatePetDto> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transform(value: CreatePetDto, metadata: ArgumentMetadata): CreatePetDto {
    const petTypeEnumValues = Object.values(petTypeEnum).filter(
      (each) => typeof each === 'number',
    );
    if (
      ![null, undefined].includes(value.type) &&
      !petTypeEnumValues.includes(value.type)
    ) {
      const errorMessage = `type must be one of ${petTypeEnumValues}`;
      throw new BadRequestException(errorMessage);
    }
    return value;
  }
}
