import { Repository } from 'typeorm';
import { Job } from './job.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class JobRepository extends Repository<Job> {
  constructor(
    @InjectRepository(Job)
    repository: Repository<Job>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }

  async findJobsWithCriteria(criteria: Partial<Job>): Promise<Job[]> {
    const query = this.createQueryBuilder('job');

    if (criteria.title) {
      query.andWhere('job.title LIKE :title', { title: `%${criteria.title}%` });
    }

    if (criteria.level) {
      query.andWhere('job.level = :level', { level: criteria.level });
    }

    if (criteria.workType) {
      query.andWhere('job.workType = :workType', {
        workType: criteria.workType,
      });
    }

    query
      .innerJoin('job.company', 'company')
      .andWhere('company.isActive = :isActive', { isActive: true })
      .andWhere('company.isVerify = :isVerify', { isVerify: true });

    if (criteria.company) {
      query.andWhere('company.name LIKE :companyName', {
        companyName: `%${criteria.company}%`,
      });
    }

    return await query.getMany();
  }

  async findAllJobByCompanyId(companyId: string): Promise<Job[]> {
    return await this.createQueryBuilder('job')
      .innerJoin('job.company', 'company')
      .where('company.id = :companyId', { companyId })
      .getMany();
  }
}
