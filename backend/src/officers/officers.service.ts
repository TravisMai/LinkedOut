import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Officer } from './officers.entity';

@Injectable()
export class OfficersService {
    constructor(
        @InjectRepository(Officer)
        private officersRepository: Repository<Officer>
    ) { }

    // get all the officers
    async findAll(): Promise<Officer[]> {
        return await this.officersRepository.find();
    }

    // get one officer by id
    async findOne(id: string): Promise<Officer> {
        return await this.officersRepository.findOne({ where: { id } });
    }

    // create a new officer
    async create(officer: Officer): Promise<Officer> {
        const newOfficer = this.officersRepository.create(officer);
        return await this.officersRepository.save(newOfficer);
    }

    // update an officer
    async update(id: string, officer: Officer): Promise<Officer> {
        await this.officersRepository.update(id, officer);
        return await this.officersRepository.findOne({ where: { id } });
    }

    // delete an officer
    async delete(id: string): Promise<void> {
        await this.officersRepository.delete({ id });
    }
}
