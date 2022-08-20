import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Like, Repository } from 'typeorm';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { DeleteEmployeeDto } from './dto/delete-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { ContactInfo } from './entities/contact-info.entity';
import { Employee } from './entities/employee.entity';
import { Meeting } from './entities/meeting.entity';
import { Task } from './entities/task.entity';
import { errorMessages } from './stringTokens/errorMessages';

@Injectable()
export class EmployeesService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(ContactInfo)
    private contactInfoRepository: Repository<ContactInfo>,
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
    @InjectRepository(Meeting)
    private meetingRepository: Repository<Meeting>,
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  async initializeDatabase() {
    try {
      // * repository.save() 할 때마다 repository.save() 호출하기
      // await this.savingWheneverNewEntityCreated();
      // * cascade 속성 사용해서 repository.save() 함수 한번만 호출하기
      await this.callingRepositorySaveOnlyOnceUsingCasecadeOptionInRelationship();
    } catch (err) {
      Logger.error(err);
      throw err;
    }
  }

  private async savingWheneverNewEntityCreated() {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      const ceo = this.employeeRepository.create({ name: 'Mr. CEO' });
      await this.employeeRepository.save(ceo, { transaction: false });
      const ceoContactInfo = this.contactInfoRepository.create({
        phone: '01077773077',
        email: 'ceo_email@gmail.com',
        employee: ceo,
      });
      await this.contactInfoRepository.save(ceoContactInfo, {
        transaction: false,
      });
      const meeting1 = this.meetingRepository.create({
        zoomUrl: 'meeting1.com',
      });
      ceo.addMeetings([meeting1]);
      await this.meetingRepository.save(meeting1, { transaction: false });

      const manager = this.employeeRepository.create({
        name: 'Marius',
      });
      manager.setManager(ceo);
      await this.employeeRepository.save(manager, { transaction: false });
      const task1 = this.taskRepository.create({ title: 'Hire people' });
      await this.taskRepository.save(task1, { transaction: false });
      const task2 = this.taskRepository.create({ title: 'Present to CEO' });
      await this.taskRepository.save(task2, { transaction: false });
      manager.addTasks([task1, task2]);
      manager.addMeetings([meeting1]);
      await this.employeeRepository.save(manager, { transaction: false });
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    }
    // * 현재 함수 실행 결과 쿼리 로그
    // query: START TRANSACTION
    // query: INSERT INTO `employee`(`id`, `name`, `managerId`) VALUES (DEFAULT, ?, DEFAULT) -- PARAMETERS: ["Mr. CEO"]
    // query: INSERT INTO `contact_info`(`id`, `phone`, `email`, `employeeId`) VALUES (DEFAULT, ?, ?, ?) -- PARAMETERS: ["01077773077","ceo_email@gmail.com","1"]
    // query: INSERT INTO `meeting`(`id`, `zoomUrl`) VALUES (DEFAULT, ?) -- PARAMETERS: ["meeting1.com"]
    // query: INSERT INTO `employee`(`id`, `name`, `managerId`) VALUES (DEFAULT, ?, ?) -- PARAMETERS: ["Marius","1"]
    // query: INSERT INTO `task`(`id`, `title`, `employeeId`) VALUES (DEFAULT, ?, DEFAULT) -- PARAMETERS: ["Hire people"]
    // query: INSERT INTO `task`(`id`, `title`, `employeeId`) VALUES (DEFAULT, ?, DEFAULT) -- PARAMETERS: ["Present to CEO"]
    // query: SELECT `Employee`.`id` AS `Employee_id`, `Employee`.`name` AS `Employee_name`, `Employee`.`managerId` AS `Employee_managerId` FROM `employee` `Employee` WHERE `Employee`.`id` IN (?) -- PARAMETERS: ["2"]
    // query: SELECT `Task`.`id` AS `Task_id`, `Task`.`title` AS `Task_title`, `Task`.`employeeId` AS `Task_employeeId` FROM `task` `Task` WHERE `Task`.`id` IN (?, ?) -- PARAMETERS: ["1","2"]
    // query: SELECT `Meeting`.`id` AS `Meeting_id`, `Meeting`.`zoomUrl` AS `Meeting_zoomUrl` FROM `meeting` `Meeting` WHERE `Meeting`.`id` IN (?) -- PARAMETERS: ["1"]
    // query: SELECT `task`.`id` AS `id`, `task`.`employeeId` AS `employeeId` FROM `task` `task` WHERE ((`task`.`employeeId` = ?)) -- PARAMETERS: ["2"]
    // query: SELECT `Employee_meetings_rid`.`employeeId` AS `employeeId`, `Employee_meetings_rid`.`meetingId` AS `meetingId` FROM `meeting` `meeting` INNER JOIN `employee_meetings_meeting` `Employee_meetings_rid` ON (`Employee_meetings_rid`.`employeeId` = ? AND `Employee_meetings_rid`.`meetingId` = `meeting`.`id`) ORDER BY `Employee_meetings_rid`.`meetingId` ASC, `Employee_meetings_rid`.`employeeId` ASC -- PARAMETERS: ["2"]
    // query: INSERT INTO `employee_meetings_meeting`(`employeeId`, `meetingId`) VALUES (?, ?) -- PARAMETERS: ["2","1"]
    // query: UPDATE `task` SET `employeeId` = ? WHERE `id` IN (?) -- PARAMETERS: ["2","1"]
    // query: UPDATE `task` SET `employeeId` = ? WHERE `id` IN (?) -- PARAMETERS: ["2","2"]
    // query: COMMIT
  }

  private async callingRepositorySaveOnlyOnceUsingCasecadeOptionInRelationship() {
    const ceo = this.employeeRepository.create({ name: 'Mr. CEO' });
    const ceoContactInfo = this.contactInfoRepository.create({
      phone: '01077773077',
      email: 'ceo_email@gmail.com',
    });
    ceo.setContactInfo(ceoContactInfo);
    const meeting1 = this.meetingRepository.create({
      zoomUrl: 'meeting1.com',
    });
    ceo.addMeetings([meeting1]);

    const manager = this.employeeRepository.create({
      name: 'Marius',
    });
    const task1 = this.taskRepository.create({ title: 'Hire people' });
    const task2 = this.taskRepository.create({ title: 'Present to CEO' });
    manager.addTasks([task1, task2]);
    manager.addMeetings([meeting1]);
    ceo.addDirectReports([manager]);
    await this.employeeRepository.save(ceo);
    // * 현재 함수 실행 결과 쿼리 로그
    // query: START TRANSACTION
    // query: INSERT INTO `employee`(`id`, `name`, `managerId`) VALUES (DEFAULT, ?, DEFAULT) -- PARAMETERS: ["Mr. CEO"]
    // query: INSERT INTO `employee`(`id`, `name`, `managerId`) VALUES (DEFAULT, ?, ?) -- PARAMETERS: ["Marius","1"]
    // query: INSERT INTO `contact_info`(`id`, `phone`, `email`, `employeeId`) VALUES (DEFAULT, ?, ?, ?) -- PARAMETERS: ["01077773077","ceo_email@gmail.com","1"]
    // query: INSERT INTO `task`(`id`, `title`, `employeeId`) VALUES (DEFAULT, ?, ?) -- PARAMETERS: ["Hire people","2"]
    // query: INSERT INTO `task`(`id`, `title`, `employeeId`) VALUES (DEFAULT, ?, ?) -- PARAMETERS: ["Present to CEO","2"]
    // query: INSERT INTO `meeting`(`id`, `zoomUrl`) VALUES (DEFAULT, ?) -- PARAMETERS: ["meeting1.com"]
    // query: INSERT INTO `employee_meetings_meeting`(`employeeId`, `meetingId`) VALUES (?, ?), (?, ?) -- PARAMETERS: ["1","1","2","1"]
    // query: COMMIT
  }

  async createOneEmployee(
    createEmployeeDto: CreateEmployeeDto,
  ): Promise<Employee> {
    const newEmployee = this.employeeRepository.create(createEmployeeDto);
    return this.employeeRepository.save(newEmployee);
  }

  async findManyEmployees(name?: string): Promise<Employee[]> {
    if (name) {
      return this.employeeRepository.find({
        where: {
          name: Like(`%${name}%`),
        },
        relations: [
          'manager',
          'directReports',
          'contactInfo',
          'tasks',
          'meetings',
        ],
      });
    }
    return this.employeeRepository.find({
      relations: [
        'manager',
        'directReports',
        'contactInfo',
        'tasks',
        'meetings',
      ],
    });
  }

  async findOneEmployeeById(id: number): Promise<Employee> {
    const employee = await this.employeeRepository.findOne({
      where: { id },
      relations: [
        'manager',
        'directReports',
        'contactInfo',
        'tasks',
        'meetings',
      ],
    });
    if (!employee) throw new NotFoundException(errorMessages.NOT_FOUND);
    return employee;
  }

  async updateOneEmployee(
    id: number,
    updateEmployeeDto: UpdateEmployeeDto,
  ): Promise<Employee> {
    const employee = await this.employeeRepository.findOne({
      where: { id },
      relations: [
        'manager',
        'directReports',
        'contactInfo',
        'tasks',
        'meetings',
      ],
    });
    if (!employee) throw new NotFoundException(errorMessages.NOT_FOUND);
    if (updateEmployeeDto.name) employee.name = updateEmployeeDto.name;
    return this.employeeRepository.save(employee);
  }

  async removeOneEmployee(id: number): Promise<DeleteEmployeeDto> {
    const employee = await this.employeeRepository.findOne({
      where: { id },
      relations: [
        'manager',
        'directReports',
        'contactInfo',
        'tasks',
        'meetings',
      ],
    });
    if (!employee) throw new NotFoundException(errorMessages.NOT_FOUND);
    return this.employeeRepository.remove(employee);
  }
}
