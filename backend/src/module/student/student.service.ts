import { Repository } from 'typeorm';
import { Student } from './student.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StudentRepository } from './student.repository';

@Injectable()
export class StudentService {
    constructor(
        private studentRepository: StudentRepository,
    ) { }

    // get all the students
    async findAll(): Promise<Student[]> {
        return await this.studentRepository.find();
    }

    // get one student by id
    async findOne(id: string): Promise<Student> {
        return await this.studentRepository.findOne({ where: { id } });
    }

    // create a new student
    async create(student: Student): Promise<Student> {
        const newStaff = await this.studentRepository.createStudent(student);
        return await this.studentRepository.save(newStaff);
    }

    // update an student
    async update(id: string, student: Student): Promise<Student> {
        await this.studentRepository.update(id, student);
        return await this.studentRepository.findOne({ where: { id } });
    }

    // delete an student
    async delete(id: string): Promise<void> {
        await this.studentRepository.delete({ id });
    }

    // find an student by email
    async findByEmail(email: string): Promise<Student> {
        return await this.studentRepository.findOne({ where: { email } });
    }
}
