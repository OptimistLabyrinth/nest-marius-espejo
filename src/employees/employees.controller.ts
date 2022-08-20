import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { DeleteEmployeeDto } from './dto/delete-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { EmployeesService } from './employees.service';
import { Employee } from './entities/employee.entity';

@ApiTags('employees')
@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @ApiOkResponse({ type: String })
  @ApiInternalServerErrorResponse()
  @Post('initialize-database')
  async initializeDatabase() {
    await this.employeesService.initializeDatabase();
    return 'successfully initialized database';
  }

  @ApiCreatedResponse({ type: Employee })
  @ApiBadRequestResponse()
  @Post()
  async createEmployee(
    @Body() createEmployeeDto: CreateEmployeeDto,
  ): Promise<Employee> {
    return this.employeesService.createOneEmployee(createEmployeeDto);
  }

  @ApiQuery({ name: 'name', type: String, required: false })
  @ApiOkResponse({ type: Employee, isArray: true })
  @Get()
  async findEmployees(@Query('name') name?: string): Promise<Employee[]> {
    return this.employeesService.findManyEmployees(name);
  }

  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ type: Employee })
  @ApiNotFoundResponse()
  @Get(':id')
  async findEmployee(@Param('id', ParseIntPipe) id: number): Promise<Employee> {
    return this.employeesService.findOneEmployeeById(id);
  }

  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ type: Employee })
  @ApiNotFoundResponse()
  @ApiBadRequestResponse()
  @Patch(':id')
  async updateEmployee(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
  ): Promise<Employee> {
    return this.employeesService.updateOneEmployee(id, updateEmployeeDto);
  }

  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ type: DeleteEmployeeDto })
  @ApiNotFoundResponse()
  @Delete(':id')
  async removeEmployee(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<DeleteEmployeeDto> {
    return this.employeesService.removeOneEmployee(id);
  }
}
