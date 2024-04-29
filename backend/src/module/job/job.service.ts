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
      ])
      .getMany();

    return jobs;
  }

  // get a job by id
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
}
