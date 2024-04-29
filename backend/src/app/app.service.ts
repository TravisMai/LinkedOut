import { Injectable } from '@nestjs/common';
import { CompanyRepository } from 'src/module/company/company.repository';
import { InternshipRepository } from 'src/module/internship/internship.repository';
import { JobRepository } from 'src/module/job/job.repository';
import { JobApplicantsRepository } from 'src/module/jobApplicants/jobApplicants.repository';
import { StaffRepository } from 'src/module/staff/staff.repository';
import { StudentRepository } from 'src/module/student/student.repository';

@Injectable()
export class AppService {
  constructor(
    private studentRepo: StudentRepository,
    private internshipRepo: InternshipRepository,
    private jobRepo: JobRepository,
    private jobApplicantsRepo: JobApplicantsRepository,
    private staffRepo: StaffRepository,
    private companyRepo: CompanyRepository,
  ) {}

  async search(keyword: string) {
    const normalizedKeyword = keyword
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

    const queryResults = await Promise.all([
      this.getCompanies(normalizedKeyword),
      this.getJobs(normalizedKeyword),
      this.getStaff(normalizedKeyword),
      this.getStudents(normalizedKeyword),
    ]);

    const combinedResults = queryResults
      .flat()
      .sort((a, b) => b.updated - a.updated);

    return combinedResults;
  }

  private getCompanies(keyword: string) {
    return this.companyRepo
      .createQueryBuilder('company')
      .select([
        `'company' AS source_table`,
        'company.id AS id',
        'company.name AS original_search_field',
        'company.created AS created',
        'company.updated AS updated',
      ])
      .where('unaccent(company.name) ILIKE :keyword', {
        keyword: `%${keyword}%`,
      })
      .getRawMany();
  }

  private getJobs(keyword: string) {
    return this.jobRepo
      .createQueryBuilder('job')
      .select([
        `'job' AS source_table`,
        'job.id AS id',
        'job.title AS original_search_field',
        'job.created AS created',
        'job.updated AS updated',
      ])
      .where('unaccent(job.title) ILIKE :keyword', { keyword: `%${keyword}%` })
      .getRawMany();
  }

  private getStaff(keyword: string) {
    return this.staffRepo
      .createQueryBuilder('staff')
      .select([
        `'staff' AS source_table`,
        'staff.id AS id',
        'staff.name AS original_search_field',
        'staff.created AS created',
        'staff.updated AS updated',
      ])
      .where('unaccent(staff.name) ILIKE :keyword', { keyword: `%${keyword}%` })
      .getRawMany();
  }

  private getStudents(keyword: string) {
    return this.studentRepo
      .createQueryBuilder('student')
      .select([
        `'student' AS source_table`,
        'student.id AS id',
        'student.name AS original_search_field',
        'student.created AS created',
        'student.updated AS updated',
      ])
      .where('unaccent(student.name) ILIKE :keyword', {
        keyword: `%${keyword}%`,
      })
      .getRawMany();
  }
}
