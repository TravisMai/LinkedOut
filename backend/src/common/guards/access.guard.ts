import { JwtService } from '@nestjs/jwt';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { CompanyService } from 'src/module/company/company.service';
import { StudentService } from 'src/module/student/student.service';

@Injectable()
export class AccessGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private companyService: CompanyService,
    private studentService: StudentService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization;
    const decodedToken = this.jwtService.verify(token.replace('Bearer ', ''));
    const userRole = decodedToken.role;

    if (userRole === 'company') {
      return this.checkCompany(decodedToken.id);
    }

    if (userRole === 'student') {
      return this.checkStudent(decodedToken.id);
    }

    return true;
  }

  private async checkCompany(id: string): Promise<boolean> {
    const company = await this.companyService.findOne(id);
    return company && company.isActive && company.isVerify;
  }

  private async checkStudent(id: string): Promise<boolean> {
    const student = await this.studentService.findOne(id);
    return student && student.isActive && student.isVerify;
  }
}
