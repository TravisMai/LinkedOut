import { Repository } from 'typeorm';
import { Staff } from './staffs.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class StaffService {
    constructor(
        @InjectRepository(Staff)
        private officersRepository: Repository<Staff>
    ) { }

    // get all the officers
    async findAll(): Promise<Staff[]> {
        return await this.officersRepository.find();
    }

    // get one staff by id
    async findOne(id: string): Promise<Staff> {
        return await this.officersRepository.findOne({ where: { id } });
    }

    // create a new staff
    async create(staff: Staff): Promise<Staff> {
        const newOfficer = this.officersRepository.create(staff);
        return await this.officersRepository.save(newOfficer);
    }

    // update an staff
    async update(id: string, staff: Staff): Promise<Staff> {
        await this.officersRepository.update(id, staff);
        return await this.officersRepository.findOne({ where: { id } });
    }

    // delete an staff
    async delete(id: string): Promise<void> {
        await this.officersRepository.delete({ id });
    }

    // find an staff by email
    async findByEmail(email: string): Promise<Staff> {
        return await this.officersRepository.findOne({ where: { email } });
    }
}
