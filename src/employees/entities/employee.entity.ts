import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ContactInfo } from './contact-info.entity';
import { Meeting } from './meeting.entity';
import { Task } from './task.entity';

@Entity()
export class Employee {
  @ApiProperty()
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty({ type: () => Employee, nullable: true })
  @ManyToOne(() => Employee, (employee) => employee.directReports, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  manager: Employee;

  setManager(manager: Employee | null): Employee {
    this.manager = manager;
    return this;
  }

  @OneToMany(() => Employee, (employee) => employee.manager, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  directReports: Employee[];

  addDirectReports(reportsTo: Employee[]): Employee {
    if (this.directReports && Array.isArray(this.directReports)) {
      this.directReports = [...this.directReports, ...reportsTo];
    } else {
      this.directReports = reportsTo;
    }
    return this;
  }

  removeDirectReports(deletesTo: Employee[]): Employee {
    if (this.directReports && Array.isArray(this.directReports)) {
      this.directReports = this.directReports.filter(
        (eachPrev) => !deletesTo.includes(eachPrev),
      );
    }
    return this;
  }

  @ApiProperty({ type: () => ContactInfo, nullable: true })
  @OneToOne(() => ContactInfo, (contactInfo) => contactInfo.employee, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  contactInfo: ContactInfo;

  setContactInfo(contactInfo: ContactInfo | null): Employee {
    this.contactInfo = contactInfo;
    return this;
  }

  @ApiProperty({ type: Task, isArray: true, nullable: true })
  @OneToMany(() => Task, (task) => task.employee, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  tasks: Task[];

  addTasks(tasks: Task[]) {
    if (this.tasks) {
      this.tasks = [...this.tasks, ...tasks];
    } else {
      this.tasks = tasks;
    }
    return this;
  }

  removeTasks(deletesTo: Task[]): Employee {
    if (this.tasks && Array.isArray(this.tasks)) {
      this.tasks = this.tasks.filter(
        (eachPrev) => !deletesTo.includes(eachPrev),
      );
    }
    return this;
  }

  @ApiProperty({ type: Meeting, isArray: true, nullable: true })
  @ManyToMany(() => Meeting, (meeting) => meeting.attendees, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinTable()
  meetings: Meeting[];

  addMeetings(meetings: Meeting[]): Employee {
    if (this.meetings) {
      this.meetings = [...this.meetings, ...meetings];
    } else {
      this.meetings = meetings;
    }
    return this;
  }

  removeMeetings(deletesTo: Meeting[]): Employee {
    if (this.meetings && Array.isArray(this.meetings)) {
      this.meetings = this.meetings.filter(
        (eachPrev) => !deletesTo.includes(eachPrev),
      );
    }
    return this;
  }
}
