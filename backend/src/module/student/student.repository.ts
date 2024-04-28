import { Repository } from 'typeorm';
import { Student } from './student.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class StudentRepository extends Repository<Student> {
  constructor(
    @InjectRepository(Student)
    repository: Repository<Student>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }

  // create a new student
  async createStudent(student: Student): Promise<Student> {
    const newStudent = this.create({
      ...student,
      role: 'student',
      isVerify: false,
    });
    return await this.save(newStudent);
  }
}
