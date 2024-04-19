import { Job } from "../job.entity";
import { CompanyResponseDto } from "src/module/company/dto/companyResponse.dto";
import { PostDescription } from "src/common/interfaces/postDescription.interface";

export class JobResponseDto {
    id: string;
    company: CompanyResponseDto;
    title: string;
    image: string[];
    salary: number;
    level: string;
    workType: string;
    quantity: number;
    expireDate: Date;
    descriptions: PostDescription;

    static fromJob(job: Job): JobResponseDto {
        const dto = new JobResponseDto();
        dto.id = job.id;
        dto.company = job.company;
        dto.title = job.title;
        dto.image = job.image;
        dto.salary = job.salary;
        dto.level = job.level;
        dto.workType = job.workType;
        dto.quantity = job.quantity;
        dto.expireDate = job.expireDate;
        dto.descriptions = job.descriptions;
        return dto;
    }

    static fromJobArray(jobArray: Job[]): JobResponseDto[] {
        return jobArray.map(job => this.fromJob(job));
    }
}
