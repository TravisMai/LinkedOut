import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { OAuth2Client } from 'google-auth-library';
import { JwtService } from '@nestjs/jwt';
import { StaffService } from '../staff/staff.service';
import { StudentService } from '../student/student.service';
import { Response } from 'express';
import { StudentResponseDto } from '../student/dto/studentResponse.dto';
import { StaffResponseDto } from '../staff/dto/staffResponse.dto';
import { Student } from '../student/student.entity';
import { Staff } from '../staff/staff.entity';

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
    const payload = await this.getPayloadFromToken(token);

    switch (role) {
      case 'student':
        return this.handleLogin(
          this.studentService,
          'student',
          payload,
          response,
        );
      case 'staff':
        return this.handleLogin(this.staffService, 'staff', payload, response);
      default:
        return response
          .status(HttpStatus.FORBIDDEN)
          .json({ message: 'Unauthorized access' });
    }
  }

  async getPayloadFromToken(token: string) {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    return ticket.getPayload();
  }

  private async handleLogin(
    service: StudentService | StaffService,
    role: 'student' | 'staff',
    payload: any,
    response: Response,
  ) {
    try {
      const loginUser = await service.findByEmail(payload.email);
      let limitedData;
      if (role === 'student') {
        limitedData = StudentResponseDto.fromStudent(loginUser as Student);
      } else if (role === 'staff') {
        limitedData = StaffResponseDto.fromStaff(loginUser as Staff);
      }
      const token = this.authService.generateJwtToken(loginUser);
      return response
        .status(HttpStatus.OK)
        .json({ [role]: limitedData, token });
    } catch (error) {
      return response.status(error.status).json({ message: error.message });
    }
  }

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
