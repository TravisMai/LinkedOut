import { Staff } from './staff.entity';
import { Injectable } from '@nestjs/common';
import { StaffRepository } from './staff.repository';
import { StaffUpdateDto } from './dto/staffUpdate.dto';

@Injectable()
export class StaffService {
    constructor(
        private staffRepository: StaffRepository
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
        const newStaff = await this.staffRepository.createStaff(staff);
        return await this.staffRepository.save(newStaff);
    }

    // update an staff
    async update(id: string, staff: StaffUpdateDto): Promise<Staff> {
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
