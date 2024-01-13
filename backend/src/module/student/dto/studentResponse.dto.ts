import { Student } from "../student.entity";

export class StudentResponseDto {
    id: string;
    name: string;
    email: string;
    phoneNumber: string;
    avatar: string;
    studentId: number;
    isGoogle: boolean;
    isVerify: boolean;

    static fromStudent(student: Student): StudentResponseDto {
        const dto = new StudentResponseDto();
        dto.id = student.id;
        dto.name = student.name;
        dto.email = student.email;
        dto.phoneNumber = student.phoneNumber;
        dto.avatar = student.avatar;
        dto.studentId = student.studentId;
        dto.isVerify = student.isVerify;
        return dto;
    }

    static fromStudentArray(studentArray: Student[]): StudentResponseDto[] {
        return studentArray.map(student => this.fromStudent(student));
    }
}
