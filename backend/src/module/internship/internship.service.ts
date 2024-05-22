import { Injectable } from '@nestjs/common';
import { InternshipRepository } from './internship.repository';
import { Internship } from './internship.entity';

@Injectable()
export class InternshipService {
  constructor(private internshipRepository: InternshipRepository) {}

  // create a new internship
  async create(internship: Internship): Promise<Internship> {
    const newInternship = this.internshipRepository.create(internship);
    return await this.internshipRepository.save(newInternship);
  }

  // find all internships
  async findAll(): Promise<Internship[]> {
    return await this.internshipRepository.find();
  }

  // find an internship by id
  async findOne(id: string): Promise<Internship> {
    return await this.internshipRepository.findOne({ where: { id } });
  }

  // update an internship
  async update(id: string, internship: Internship): Promise<Internship> {
    await this.internshipRepository.update(id, internship);
    return await this.internshipRepository.findOne({ where: { id } });
  }

  // delete an internship
  async delete(id: string): Promise<void> {
    await this.internshipRepository.delete(id);
  }

  // find all internships by company id
  async findInternshipsByCompanyId(companyId: string): Promise<Internship[]> {
    return await this.internshipRepository.findInternshipsByCompanyId(
      companyId,
    );
  }

  // find all internships by student id
  async findByCandidateId(studentId: string): Promise<Internship[]> {
    return await this.internshipRepository.findByCandidateId(studentId);
  }

  async findByJobId(jobId: string): Promise<Internship[]> {
    return await this.internshipRepository.findByJobId(jobId);
  }
}
