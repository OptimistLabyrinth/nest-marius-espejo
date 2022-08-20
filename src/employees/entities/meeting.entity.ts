import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Employee } from './employee.entity';

@Entity()
export class Meeting {
  @ApiProperty()
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @ApiProperty()
  @Column()
  zoomUrl: string;

  @ApiProperty({ type: Employee, isArray: true, nullable: true })
  @ManyToMany(() => Employee, (employee) => employee.meetings, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  attendees: Employee[];

  addAttendees(attendees: Employee[]): Meeting {
    if (this.attendees && Array.isArray(this.attendees)) {
      this.attendees = [...this.attendees, ...attendees];
    } else {
      this.attendees = attendees;
    }
    return this;
  }

  removeAttendees(deletesTo: Employee[]): Meeting {
    if (this.attendees && Array.isArray(this.attendees)) {
      this.attendees = this.attendees.filter(
        (eachPrev) => !deletesTo.includes(eachPrev),
      );
    }
    return this;
  }
}
