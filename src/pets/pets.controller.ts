import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { DeletePetDto } from './dto/delete-pet.dto';
import { Pet } from './entities/pet.entity';
import { PetsService } from './pets.service';
import { PetTypeValidationPipe } from './validators/PetTypeValidationPipe';

@ApiTags('pets')
@Controller('pets')
export class PetsController {
  constructor(private readonly petsService: PetsService) {}

  @ApiCreatedResponse({ type: Pet })
  @ApiBadRequestResponse()
  @Post()
  async createPet(
    @Body(PetTypeValidationPipe) createPetDto: CreatePetDto,
  ): Promise<Pet> {
    return this.petsService.create(createPetDto);
  }

  @ApiQuery({ name: 'name', type: String, required: false })
  @ApiOkResponse({ type: Pet, isArray: true })
  @Get()
  findManyPets(@Query('name') name?: string): Promise<Pet[]> {
    return this.petsService.findMany(name);
  }

  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ type: Pet })
  @ApiNotFoundResponse()
  @Get(':id')
  findPet(@Param('id', ParseIntPipe) id: number): Promise<Pet> {
    return this.petsService.findOneById(id);
  }

  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ type: Pet })
  @ApiNotFoundResponse()
  @ApiBadRequestResponse()
  @Patch(':id')
  updatePet(
    @Param('id', ParseIntPipe) id: number,
    @Body(PetTypeValidationPipe) updatePetDto: UpdatePetDto,
  ): Promise<Pet> {
    return this.petsService.update(id, updatePetDto);
  }

  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ type: DeletePetDto })
  @ApiNotFoundResponse()
  @Delete(':id')
  removePet(@Param('id', ParseIntPipe) id: number): Promise<DeletePetDto> {
    return this.petsService.remove(id);
  }
}
