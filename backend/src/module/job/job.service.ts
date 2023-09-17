import { Injectable } from '@nestjs/common';
import { Job } from './job.entity';
import { JobRepository } from './job.repository';

@Injectable()
export class JobService {
    constructor(
        private companyRepository: JobRepository
    ) { }

    // get all the jobs
    async findAll(): Promise<Job[]> {
        return await this.companyRepository.find();
    }

    // get one job by id
    async findOne(id: string): Promise<Job> {
        return await this.companyRepository.findOne({ where: { id } });
    }

    // get jobs with criteria
    async findJobsWithCriteria(criteria: Partial<Job>): Promise<Job[]> {
        return await this.companyRepository.findJobsWithCriteria(criteria);
    }

    // create a new job
    async create(job: Job): Promise<Job> {
        const newJob = this.companyRepository.create(job);
        return await this.companyRepository.save(newJob);
    }

    // update a job
    async update(id: string, job: Job): Promise<Job> {
        await this.companyRepository.update(id, job);
        return await this.companyRepository.findOne({ where: { id } });
    }

    // delete a job
    async delete(id: string): Promise<void> {
        await this.companyRepository.delete({ id });
    }
}
