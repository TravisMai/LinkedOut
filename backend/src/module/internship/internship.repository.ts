import { Repository } from 'typeorm';
import { Internship } from './internship.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class InternshipRepository extends Repository<Internship> {
    constructor(
        @InjectRepository(Internship)
        repository: Repository<Internship>,
    ) {
        super(repository.target, repository.manager, repository.queryRunner);
    }

    // find all internships by company id
    async findInternshipsByCompanyId(companyId: string): Promise<Internship[]> {
        return await this.createQueryBuilder('internship')
            .leftJoinAndSelect('internship.company', 'company')
            .where('company.id = :companyId', { companyId })
            .getMany();
    }
}