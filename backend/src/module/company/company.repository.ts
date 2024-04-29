import { Repository } from 'typeorm';
import { Company } from './company.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CompanyRepository extends Repository<Company> {
  constructor(
    @InjectRepository(Company)
    repository: Repository<Company>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }

  // create a new company
  async createCompany(company: Company): Promise<Company> {
    const newCompany = this.create({
      ...company,
      role: 'company',
    });
    return await this.save(newCompany);
  }
}
