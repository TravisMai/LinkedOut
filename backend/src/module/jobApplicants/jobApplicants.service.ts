import { Injectable } from '@nestjs/common';
import { JobApplicants } from './jobApplicants.entity';
import { JobApplicantsRepository } from './jobApplicants.repository';

@Injectable()
export class JobApplicantsService {
  constructor(private jobApplicantsRepository: JobApplicantsRepository) {}

  // create a new jobApplicants
  async create(jobApplicants: JobApplicants): Promise<JobApplicants> {
    const newJobApplicants = this.jobApplicantsRepository.create(jobApplicants);
    return await this.jobApplicantsRepository.save(newJobApplicants);
  }

  // find a job applicant by id
  async findOne(id: string): Promise<JobApplicants> {
    return await this.jobApplicantsRepository.findOne({ where: { id } });
  }

  // find all jobApplicants by job id
  async findJobApplicantsByJobId(jobId: string): Promise<JobApplicants[]> {
    return await this.jobApplicantsRepository.findJobApplicantsByJobId(jobId);
  }

  // find all jobApplicants by candidate id
  async findJobApplicantsByCandidateId(
    candidateId: string,
  ): Promise<JobApplicants[]> {
    return await this.jobApplicantsRepository.findJobApplicantsByCandidateId(
      candidateId,
    );
  }

  // find a job applicant by job id and candidate id
  async findJobApplicantsByJobIdAndCandidateId(
    jobId: string,
    candidateId: string,
  ): Promise<JobApplicants> {
    return await this.jobApplicantsRepository.findJobApplicantsByJobIdAndCandidateId(
      jobId,
      candidateId,
    );
  }

  // delete a job applicant
  async delete(id: string): Promise<void> {
    await this.jobApplicantsRepository.delete(id);
  }

  async findJobApplicantsById(id: string): Promise<JobApplicants> {
    return await this.jobApplicantsRepository.findOne({
      where: { id },
      relations: ['job', 'student', 'resume'],
    });
  }
}
