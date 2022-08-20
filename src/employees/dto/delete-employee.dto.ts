import { OmitType } from '@nestjs/swagger';
import { Employee } from '../entities/employee.entity';

export class DeleteEmployeeDto extends OmitType(Employee, ['id']) {}
