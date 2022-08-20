import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Employee } from './employee.entity';

@Entity()
export class Task {
  @ApiProperty()
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @ApiProperty()
  @Column()
  title: string;

  @ApiProperty({ type: () => Employee, nullable: true })
  @ManyToOne(() => Employee, (employee) => employee.tasks, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  employee: Employee;

  setEmployee(employee: Employee | null): Task {
    this.employee = employee;
    return this;
  }
}
