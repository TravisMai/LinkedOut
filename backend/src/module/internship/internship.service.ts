import { Injectable } from '@nestjs/common';
import { InternshipRepository } from './internship.repository';
import { Internship } from './internship.entity';

@Injectable()
export class InternshipService {
  constructor(private InternshipRepository: InternshipRepository) {}

  // create a new internship
  async create(internship: Internship): Promise<Internship> {
    const newInternship = this.InternshipRepository.create(internship);
    return await this.InternshipRepository.save(newInternship);
  }

  // find all internships
  async findAll(): Promise<Internship[]> {
    return await this.InternshipRepository.find();
  }

  // find an internship by id
  async findOne(id: string): Promise<Internship> {
    return await this.InternshipRepository.findOne({ where: { id } });
  }

  // update an internship
  async update(id: string, internship: Internship): Promise<Internship> {
    await this.InternshipRepository.update(id, internship);
    return await this.InternshipRepository.findOne({ where: { id } });
  }

  // delete an internship
  async delete(id: string): Promise<void> {
    await this.InternshipRepository.delete(id);
  }

  // find all internships by company id
  async findInternshipsByCompanyId(companyId: string): Promise<Internship[]> {
    return await this.InternshipRepository.findInternshipsByCompanyId(
      companyId,
    );
  }

  // find all internships by student id
  async findByCandidateId(studentId: string): Promise<Internship[]> {
    return await this.InternshipRepository.findByCandidateId(studentId);
  }
}
