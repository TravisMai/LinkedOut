import { Injectable } from '@nestjs/common';
import { JobApplicants } from './jobApplicants.entity';
import { JobApplicantsRepository } from './jobApplicants.repository';
import { Job } from '../job/job.entity';

@Injectable()
export class JobApplicantsService {
    constructor(
        private jobApplicantsRepository: JobApplicantsRepository
    ) { }

    // create a new jobApplicants
    async create(jobApplicants: JobApplicants): Promise<JobApplicants> {
        const newJobApplicants = this.jobApplicantsRepository.create(jobApplicants);
        return await this.jobApplicantsRepository.save(newJobApplicants);
    }

    // find a job by id
    async findOne(id: string): Promise<JobApplicants> {
        return await this.jobApplicantsRepository.findOne({ where: { id } });
    }

    // find all jobApplicants by job id
    async findJobApplicantsByJobId(jobId: string): Promise<JobApplicants[]> {
        return await this.jobApplicantsRepository.findJobApplicantsByJobId(jobId);
    }

    async findJobApplicantsByCandidateId(candidateId: string): Promise<JobApplicants[]> {
        return await this.jobApplicantsRepository.findJobApplicantsByCandidateId(candidateId);
    }
}
