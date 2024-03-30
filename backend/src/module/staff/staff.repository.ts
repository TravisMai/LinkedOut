import { Repository } from 'typeorm';
import { Staff } from './staff.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class StaffRepository extends Repository<Staff> {
    constructor(
        @InjectRepository(Staff)
        repository: Repository<Staff>,
    ) {
        super(repository.target, repository.manager, repository.queryRunner);
    }

    // create a new staff
    async createStaff(staff: Staff): Promise<Staff> {
        const newStaff = this.create({
            ...staff,
            role: "staff",
            isAdmin: false,
        });
        return await this.save(newStaff);
    }

    // get a random staff
    async getRandomStaff(): Promise<Staff> {
        return await this.createQueryBuilder('staff')
            .orderBy('RANDOM()')
            .limit(1)
            .getOne();
    }
}