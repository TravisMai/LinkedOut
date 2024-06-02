import { Injectable } from '@nestjs/common';
import { CompanyRepository } from 'src/module/company/company.repository';
import { JobRepository } from 'src/module/job/job.repository';
import { StudentRepository } from 'src/module/student/student.repository';

@Injectable()
export class AppService {
  constructor(
    private studentRepo: StudentRepository,
    private jobRepo: JobRepository,
    private companyRepo: CompanyRepository,
  ) {}

  async search(keyword: string) {
    const normalizedKeyword = keyword
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

    const queryResults = await Promise.all([
      this.getCompanies(normalizedKeyword),
      this.getJobs(normalizedKeyword),
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
        `'company' AS entity`,
        'company.id AS id',
        'company.name AS original_search_field',
        'company.created AS created',
        'company.updated AS updated',
      ])
      .where('public.unaccent(company.name) ILIKE :keyword', {
        keyword: `%${keyword}%`,
      })
      .andWhere('company.isVerify = true')
      .andWhere('company.isActive = true')
      .getRawMany();
  }

  private getJobs(keyword: string) {
    return this.jobRepo
      .createQueryBuilder('job')
      .select([
        `'job' AS entity`,
        'job.id AS id',
        'job.title AS original_search_field',
        'job.created AS created',
        'job.updated AS updated',
      ])
      .innerJoin('job.company', 'company')
      .where('public.unaccent(job.title) ILIKE :keyword', {
        keyword: `%${keyword}%`,
      })
      .andWhere('company.isVerify = true')
      .andWhere('company.isActive = true')
      .getRawMany();
  }

  private getStudents(keyword: string) {
    return this.studentRepo
      .createQueryBuilder('student')
      .select([
        `'student' AS entity`,
        'student.id AS id',
        'student.name AS original_search_field',
        'student.created AS created',
        'student.updated AS updated',
      ])
      .where('public.unaccent(student.name) ILIKE :keyword', {
        keyword: `%${keyword}%`,
      })
      .getRawMany();
  }
}
