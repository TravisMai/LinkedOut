import { Repository } from 'typeorm';
import { Student } from './student.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class StudentService {
    constructor(
        @InjectRepository(Student)
        private staffRepository: Repository<Student>
    ) { }

    // get all the students
    async findAll(): Promise<Student[]> {
        return await this.staffRepository.find();
    }

    // get one student by id
    async findOne(id: string): Promise<Student> {
        return await this.staffRepository.findOne({ where: { id } });
    }

    // create a new student
    async create(student: Student): Promise<Student> {
        const newStaff = this.staffRepository.create(student);
        return await this.staffRepository.save(newStaff);
    }

    // update an student
    async update(id: string, student: Student): Promise<Student> {
        await this.staffRepository.update(id, student);
        return await this.staffRepository.findOne({ where: { id } });
    }

    // delete an student
    async delete(id: string): Promise<void> {
        await this.staffRepository.delete({ id });
    }

    // find an student by email
    async findByEmail(email: string): Promise<Student> {
        return await this.staffRepository.findOne({ where: { email } });
    }
}
