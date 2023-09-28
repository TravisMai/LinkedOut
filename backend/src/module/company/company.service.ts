import { Company } from './company.entity';
import { Injectable } from '@nestjs/common';
import { CompanyRepository } from './company.repository';

@Injectable()
export class CompanyService {
    constructor(
        private companyRepository: CompanyRepository
    ) { }

    // get all the companys
    async findAll(): Promise<Company[]> {
        return await this.companyRepository.find();
    }

    // get one company by id
    async findOne(id: string): Promise<Company> {
        return await this.companyRepository.findOne({ where: { id } });
    }

    // create a new company
    async create(company: Company): Promise<Company> {
        const newCompany = this.companyRepository.create(company);
        return await this.companyRepository.save(newCompany);
    }

    // update an company
    async update(id: string, company: Company): Promise<Company> {
        await this.companyRepository.update(id, company);
        return await this.companyRepository.findOne({ where: { id } });
    }

    // delete an company
    async delete(id: string): Promise<void> {
        await this.companyRepository.delete({ id });
    }

    // find an company by email
    async findByEmail(email: string): Promise<Company> {
        return await this.companyRepository.findOne({ where: { email } });
    }
}
