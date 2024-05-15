import { JwtService } from '@nestjs/jwt';
import validate = require('uuid-validate');
import { Student } from './student.entity';
import { Request, Response } from 'express';
import { StudentService } from './student.service';
import { StaffService } from '../staff/staff.service';
import { JwtGuard } from 'src/common/guards/jwt.guard';
import { RolesGuard } from 'src/common/guards/role.guard';
import { AuthService } from 'src/module/auth/auth.service';
import { CompanyService } from '../company/company.service';
import { RedisService } from 'src/module/redis/redis.service';
import { AllowRoles } from 'src/common/decorators/role.decorator';
import {
  expireTimeOneDay,
  expireTimeOneHour,
  StudentListKey,
} from 'src/common/variables/constVariable';
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  Res,
  HttpStatus,
  Req,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
} from '@nestjs/common';
import { StudentUpdateDto } from './dto/studentUpdate.dto';
import {
  FileInterceptor,
  FileFieldsInterceptor,
} from '@nestjs/platform-express';
import { AzureBlobService } from 'src/common/service/azureBlob.service';
import { v4 as uuidv4 } from 'uuid';
import { ResumeDTO } from './dto/resume.dto';

@Controller('student')
export class StudentController {
  constructor(
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
    private readonly staffService: StaffService,
    private readonly redisService: RedisService,
    private readonly studentService: StudentService,
    private readonly companyService: CompanyService,
    private readonly azureBlobService: AzureBlobService,
  ) {}

  @Get('me')
  @AllowRoles(['student'])
  @UseGuards(JwtGuard, RolesGuard)
  async getMyProfile(
    @Req() req: any,
    @Res() response: Response,
  ): Promise<Response> {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decodedToken = this.jwtService.decode(token) as { id: string };
      const cachedData = await this.redisService.getObjectByKey(
        `STUDENT:${decodedToken.id}`,
      );
      if (cachedData) {
        return response.status(HttpStatus.OK).json(cachedData);
      }
      const findMeResult = await this.studentService.findOne(decodedToken.id);
      if (!findMeResult) {
        return response
          .status(HttpStatus.NOT_FOUND)
          .json({ message: 'Student not found!' });
      }
      await this.redisService.setObjectByKeyValue(
        `STUDENT:${decodedToken.id}`,
        findMeResult,
        expireTimeOneHour,
      );
      return response.status(HttpStatus.OK).json(findMeResult);
    } catch (error) {
      return response
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }

  // get all the student
  @Get()
  @AllowRoles(['staff', 'company'])
  @UseGuards(JwtGuard, RolesGuard)
  async findAll(
    @Req() req: Request,
    @Res() response: Response,
  ): Promise<Response> {
    try {
      const cachedData = await this.redisService.getObjectByKey(StudentListKey);
      if (cachedData) {
        return response.status(HttpStatus.OK).json(cachedData);
      } else {
        const findAllResult = await this.studentService.findAll();
        if (!findAllResult || findAllResult.length === 0) {
          return response
            .status(HttpStatus.NOT_FOUND)
            .json({ message: 'Student list is empty!' });
        }
        await this.redisService.setObjectByKeyValue(
          StudentListKey,
          findAllResult,
          120,
        );
        return response.status(HttpStatus.OK).json(findAllResult);
      }
    } catch (error) {
      return response
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }

  // get one student by id
  @Get(':id')
  @AllowRoles(['staff', 'company'])
  @UseGuards(JwtGuard, RolesGuard)
  async findOne(
    @Param('id') id: string,
    @Res() response: Response,
  ): Promise<Response> {
    try {
      if (!validate(id)) {
        return response
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: 'Invalid UUID format' });
      }
      const cachedData = await this.redisService.getObjectByKey(
        `STUDENT:${id}`,
      );
      if (cachedData) {
        return response.status(HttpStatus.OK).json(cachedData);
      } else {
        const student = await this.studentService.findOne(id);
        if (!student) {
          return response
            .status(HttpStatus.NOT_FOUND)
            .json({ message: 'Student not found!' });
        }
        await this.redisService.setObjectByKeyValue(
          `STUDENT:${id}`,
          student,
          expireTimeOneHour,
        );
        return response.status(HttpStatus.OK).json(student);
      }
    } catch (error) {
      return response
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }

  // Create a new student and return the student along with a JWT token
  @Post()
  @UseInterceptors(FileInterceptor('myfile'))
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() student: Student,
    @Res() response: Response,
  ): Promise<Response> {
    if (
      (await this.staffService.findByEmail(student.email)) ||
      (await this.studentService.findByEmail(student.email)) ||
      (await this.companyService.findByEmail(student.email))
    ) {
      return response
        .status(HttpStatus.CONFLICT)
        .json({ message: 'Email already exists!' });
    }
    try {
      if (file) {
        student.avatar = await this.azureBlobService.upload(file);
      }
      const newCreateStudent = await this.studentService.create(student);
      await this.redisService.setObjectByKeyValue(
        `STUDENT:${newCreateStudent.id}`,
        newCreateStudent,
        expireTimeOneHour,
      );
      const token = this.authService.generateJwtToken(newCreateStudent);
      return response
        .status(HttpStatus.CREATED)
        .json({ student: newCreateStudent, token });
    } catch (error) {
      return response
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }

  // update an student
  @Put(':id')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'avatar', maxCount: 1 },
      { name: 'resume', maxCount: 1 },
    ]),
  )
  async update(
    @UploadedFiles()
    files: { avatar?: Express.Multer.File[]; resume?: Express.Multer.File[] },
    @Param('id') id: string,
    @Body() student: StudentUpdateDto,
    @Req() req: Request,
    @Res() response: Response,
  ): Promise<Response> {
    try {
      if (!validate(id)) {
        return response
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: 'Invalid UUID format' });
      }
      const findStudent = await this.studentService.findOne(id);
      // const decodedToken = this.jwtService.decode(
      //   req.headers.authorization.split(' ')[1],
      // ) as { id: string };
      if (files.avatar && files.avatar[0]) {
        findStudent.avatar &&
          (await this.azureBlobService.delete(
            findStudent.avatar.split('/').pop(),
          ));
        student.avatar = await this.azureBlobService.upload(files.avatar[0]);
      }
      const currentResumes = findStudent.resume || [];
      if (student.deleteResumeID && student.deleteResumeID.length > 0) {
        for (let i = currentResumes.length - 1; i >= 0; i--) {
          const resume = currentResumes[i];
          if (student.deleteResumeID.includes(resume.id)) {
            await this.azureBlobService.delete(resume.url.split('/').pop());
            currentResumes.splice(i, 1);
          }
        }
        delete student.deleteResumeID;
        student.resume = currentResumes;
      }
      const resumeObjective = student.resumeObjective
        ? student.resumeObjective
        : findStudent.name;
      delete student.resumeObjective;
      if (files.resume && files.resume[0]) {
        const resumeUrl = await this.azureBlobService.upload(files.resume[0]);
        const newResumeDto = new ResumeDTO();
        newResumeDto.id = uuidv4();
        newResumeDto.title = resumeObjective;
        newResumeDto.url = resumeUrl;
        const updatedResumes = [...currentResumes, newResumeDto];
        student.resume = updatedResumes;
      }

      const updateStudent = await this.studentService.update(id, student);
      if (!updateStudent) {
        return response
          .status(HttpStatus.NOT_FOUND)
          .json({ message: 'Student not found!' });
      }
      await this.redisService.setObjectByKeyValue(
        `STUDENT:${id}`,
        updateStudent,
        expireTimeOneHour,
      );
      return response.status(HttpStatus.OK).json(updateStudent);
    } catch (error) {
      return response
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }

  // delete an student
  @Delete(':id')
  @AllowRoles(['staff'])
  @UseGuards(JwtGuard, RolesGuard)
  async delete(
    @Param('id') id: string,
    @Res() response: Response,
  ): Promise<Response> {
    if (!validate(id)) {
      return response
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'Invalid UUID format' });
    }
    const student = await this.studentService.findOne(id);
    if (!student) {
      return response
        .status(HttpStatus.NOT_FOUND)
        .json({ message: 'No student found!' });
    }
    await this.studentService.delete(id);
    await this.redisService.deleteObjectByKey(`STUDENT:${id}`);
    await this.azureBlobService.delete(student.avatar.split('/').pop());
    return response
      .status(HttpStatus.OK)
      .json({ message: 'Student deleted successfully!' });
  }

  // login
  @Post('login')
  async login(
    @Req() req: Request,
    @Body() loginData: { email: string; password: string },
    @Res() response: Response,
  ): Promise<Response> {
    try {
      const authorizationHeader = req.headers.authorization;
      if (authorizationHeader) {
        const temp = req.headers.authorization.split(' ')[1];
        const cachedData = await this.redisService.getObjectByKey(
          `AUTH:${temp}`,
        );
        if (cachedData) {
          return response.status(HttpStatus.OK).json({ token: cachedData });
        }
      }
      const student = await this.studentService.findByEmail(loginData.email);
      if (!student) {
        return response
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: 'Invalid credentials' });
      }
      const token = this.authService.generateJwtToken(student);
      await this.redisService.setObjectByKeyValue(
        `AUTH:${token}`,
        token,
        expireTimeOneDay,
      );
      return response.status(HttpStatus.OK).json({ token });
    } catch (error) {
      return response.status(error.status).json({ message: error.message });
    }
  }

  // logout
  @Post('logout')
  @AllowRoles(['student'])
  @UseGuards(JwtGuard, RolesGuard)
  async logout(
    @Req() req: Request,
    @Res() response: Response,
  ): Promise<Response> {
    try {
      const token = req.headers.authorization.split(' ')[1];
      await this.redisService.deleteObjectByKey(`AUTH:${token}`);
      await this.redisService.setObjectByKeyValue(
        `BLACKLIST:${token}`,
        token,
        expireTimeOneDay,
      );
      return response
        .status(HttpStatus.OK)
        .json({ message: 'Logout successfully!' });
    } catch (error) {
      return response.status(error.status).json({ message: error.message });
    }
  }
}
