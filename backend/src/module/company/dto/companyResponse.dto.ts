import { Company } from '../company.entity';

export class CompanyResponseDto {
    id: string;
    name: string;
    email: string;
    phoneNumber: string;
    avatar: string;
    workField: string;
    address: string;
    website: string;
    description: string;
    taxId: number;

    static fromCompany(company: Company): CompanyResponseDto {
        const dto = new CompanyResponseDto();
        dto.id = company.id;
        dto.name = company.name;
        dto.email = company.email;
        dto.phoneNumber = company.phoneNumber;
        dto.avatar = company.avatar;
        dto.workField = company.workField;
        dto.address = company.address;
        dto.website = company.website;
        dto.description = company.description;
        dto.taxId = company.taxId;
        return dto;
    }

    static fromCompanyArray(companyArray: Company[]): CompanyResponseDto[] {
        return companyArray.map(company => this.fromCompany(company));
    }
}
