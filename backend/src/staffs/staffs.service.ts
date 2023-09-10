import { Repository } from 'typeorm';
import { Staff } from './staffs.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class StaffService {
    constructor(
        @InjectRepository(Staff)
        private staffsRepository: Repository<Staff>
    ) { }

    // get all the staffs
    async findAll(): Promise<Staff[]> {
        return await this.staffsRepository.find();
    }

    // get one staff by id
    async findOne(id: string): Promise<Staff> {
        return await this.staffsRepository.findOne({ where: { id } });
    }

    // create a new staff
    async create(staff: Staff): Promise<Staff> {
        const newStaff = this.staffsRepository.create(staff);
        return await this.staffsRepository.save(newStaff);
    }

    // update an staff
    async update(id: string, staff: Staff): Promise<Staff> {
        await this.staffsRepository.update(id, staff);
        return await this.staffsRepository.findOne({ where: { id } });
    }

    // delete an staff
    async delete(id: string): Promise<void> {
        await this.staffsRepository.delete({ id });
    }

    // find an staff by email
    async findByEmail(email: string): Promise<Staff> {
        return await this.staffsRepository.findOne({ where: { email } });
    }
}
