import { Repository } from 'typeorm';
import { Staff } from './staff.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class StaffService {
    constructor(
        @InjectRepository(Staff)
        private staffRepository: Repository<Staff>
    ) { }

    // get all the staffs
    async findAll(): Promise<Staff[]> {
        return await this.staffRepository.find();
    }

    // get one staff by id
    async findOne(id: string): Promise<Staff> {
        return await this.staffRepository.findOne({ where: { id } });
    }

    // create a new staff
    async create(staff: Staff): Promise<Staff> {
        const newStaff = this.staffRepository.create(staff);
        return await this.staffRepository.save(newStaff);
    }

    // update an staff
    async update(id: string, staff: Staff): Promise<Staff> {
        await this.staffRepository.update(id, staff);
        return await this.staffRepository.findOne({ where: { id } });
    }

    // delete an staff
    async delete(id: string): Promise<void> {
        await this.staffRepository.delete({ id });
    }

    // find an staff by email
    async findByEmail(email: string): Promise<Staff> {
        return await this.staffRepository.findOne({ where: { email } });
    }
}
