import { Staff } from '../staffs.entity';

export class StaffResponseDto {
    name: string;
    email: string;
    staffId: number;
    isAdmin: boolean;

    static fromStaff(staff: Staff): StaffResponseDto {
        const dto = new StaffResponseDto();
        dto.name = staff.name;
        dto.email = staff.email;
        dto.staffId = staff.staffId;
        dto.isAdmin = staff.isAdmin;
        return dto;
    }

    static fromStaffArray(staffArray: Staff[]): StaffResponseDto[] {
        return staffArray.map(staff => this.fromStaff(staff));
    }
}
