import { Repository } from 'typeorm';
import { JobApplicants } from './jobApplicants.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class JobApplicantsRepository extends Repository<JobApplicants> {
    constructor(
        @InjectRepository(JobApplicants)
        repository: Repository<JobApplicants>,
    ) {
        super(repository.target, repository.manager, repository.queryRunner);
    }

    // apply for a job
    async applyForJob(studentId: string, jobId: string): Promise<void> {
        console.log('studentId', studentId);
        await this.createQueryBuilder('job')
            .relation(JobApplicants, 'students')
            .of(jobId)
            .add(studentId);
    }

    async findJobApplicantsByJobId(jobId: string): Promise<JobApplicants[]> {
        return await this.createQueryBuilder('jobApplicants')
            .leftJoinAndSelect('jobApplicants.job', 'job')
            .leftJoinAndSelect('jobApplicants.student', 'student')
            .where('job.id = :jobId', { jobId })
            .getMany();
    }

    async findJobApplicantsByCandidateId(candidateId: string): Promise<JobApplicants[]> {
        return await this.createQueryBuilder('jobApplicants')
            .leftJoinAndSelect('jobApplicants.job', 'job')
            .leftJoinAndSelect('job.company', 'company') // Left join with the company entity
            .leftJoinAndSelect('jobApplicants.student', 'student')
            .where('student.id = :candidateId', { candidateId })
            .getMany();
    }

    async findJobApplicantsByJobIdAndCandidateId(jobId: string, candidateId: string): Promise<JobApplicants> {
        return await this.createQueryBuilder('jobApplicants')
            .leftJoinAndSelect('jobApplicants.student', 'student')
            .leftJoinAndSelect('jobApplicants.job', 'job')
            .where('job.id = :jobId', { jobId })
            .andWhere('student.id = :candidateId', { candidateId })
            .getOne();
    }
}