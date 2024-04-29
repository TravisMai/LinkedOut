import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { OAuth2Client } from 'google-auth-library';
import { JwtService } from '@nestjs/jwt';
import { StaffService } from '../staff/staff.service';
import { StudentService } from '../student/student.service';
import { Response } from 'express';
import { StudentResponseDto } from '../student/dto/studentResponse.dto';
import { StaffResponseDto } from '../staff/dto/staffResponse.dto';

const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
);

@Controller('auth')
export class AuthController {
  constructor(
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
    private readonly staffService: StaffService,
    private readonly studentService: StudentService,
  ) {}

  @Post('/google-login')
  async login(
    @Body('token') token: string,
    @Body('role') role: string,
    @Res() response: Response,
  ): Promise<any> {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    switch (role) {
      case 'student':
        try {
          const loginStudent = await this.studentService.findByEmail(
            payload.email,
          );
          const limitedData = StudentResponseDto.fromStudent(loginStudent);
          const token = this.authService.generateJwtToken(loginStudent);
          return response
            .status(HttpStatus.OK)
            .json({ student: limitedData, token });
        } catch (error) {
          return response.status(error.status).json({ message: error.message });
        }
      case 'staff':
        try {
          const loginStaff = await this.staffService.findByEmail(payload.email);
          const limitedData = StaffResponseDto.fromStaff(loginStaff);
          const token = this.authService.generateJwtToken(loginStaff);
          return response
            .status(HttpStatus.OK)
            .json({ staff: limitedData, token });
        } catch (error) {
          return response.status(error.status).json({ message: error.message });
        }
      default:
        return response
          .status(HttpStatus.FORBIDDEN)
          .json({ message: 'Unauthorized access' });
    }
  }

  // this will receive the role:string and the jwtToken which will take from the header from the frontend and return true if the role is match with the payload.role
  @Post('/check-role')
  async checkRole(
    @Body('role') role: string,
    @Body('jwtToken') jwtToken: string,
    @Res() response: Response,
  ): Promise<any> {
    try {
      const payload = this.jwtService.verify(jwtToken);
      return response
        .status(HttpStatus.OK)
        .json({ isMatch: payload.role === role });
    } catch (error) {
      return response
        .status(HttpStatus.FORBIDDEN)
        .json({ message: 'Unauthorized access' });
    }
  }
}
