import { Injectable } from '@nestjs/common';
import { Job } from './job.entity';
import { JobRepository } from './job.repository';

@Injectable()
export class JobService {
  constructor(private jobRepository: JobRepository) {}

  // get all the jobs
  async findAll(): Promise<Job[]> {
    const jobs = await this.jobRepository
      .createQueryBuilder('job')
      .leftJoinAndSelect('job.company', 'company')
      .select([
        'job',
        'company.id',
        'company.name',
        'company.email',
        'company.avatar',
        'company.address',
        'company.workField',
        'company.isActive',
        'company.isVerify',
      ])
      .where('company.isActive = :isActive', { isActive: true })
      .andWhere('company.isVerify = :isVerify', { isVerify: true })
      .getMany();

    return jobs;
  }

  // get a job by id when its company is not deactivated
  async findOne(id: string): Promise<Job> {
    const job = await this.jobRepository
      .createQueryBuilder('job')
      .leftJoinAndSelect('job.company', 'company')
      .select([
        'job',
        'company.id',
        'company.name',
        'company.email',
        'company.avatar',
        'company.address',
        'company.workField',
        'company.isActive',
        'company.isVerify',
      ])
      .where('job.id = :id', { id })
      .andWhere('company.isActive = :isActive', { isActive: true })
      .andWhere('company.isVerify = :isVerify', { isVerify: true })
      .getOne();

    return job;
  }

  // get a job by id dont care if its company is not deactivated
  async findOneIncludeDeactiveAccount(id: string): Promise<Job> {
    const job = await this.jobRepository
      .createQueryBuilder('job')
      .leftJoinAndSelect('job.company', 'company')
      .select([
        'job',
        'company.id',
        'company.name',
        'company.email',
        'company.avatar',
        'company.address',
        'company.workField',
        'company.isActive',
        'company.isVerify',
      ])
      .where('job.id = :id', { id })
      .getOne();

    return job;
  }

  // get jobs with criteria
  async findJobsWithCriteria(criteria: Partial<Job>): Promise<Job[]> {
    return await this.jobRepository.findJobsWithCriteria(criteria);
  }

  // create a new job
  async create(job: Job): Promise<Job> {
    const newJob = this.jobRepository.create(job);
    return await this.jobRepository.save(newJob);
  }

  // update a job
  async update(id: string, job: Job): Promise<Job> {
    await this.jobRepository.update(id, job);
    return await this.jobRepository.findOne({ where: { id } });
  }

  // delete a job
  async delete(id: string): Promise<void> {
    await this.jobRepository.delete({ id });
  }

  // find a job by title
  async findJobByTitle(value: string): Promise<Job> {
    return await this.jobRepository.findOne({ where: { title: value } });
  }

  // find all job by company id
  async findAllByCompanyId(id: string): Promise<Job[]> {
    return await this.jobRepository.findAllJobByCompanyId(id);
  }
}
