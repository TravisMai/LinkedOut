import * as bcrypt from 'bcrypt';
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
import { StudentResponseDto } from './dto/studentResponse.dto';
import { AllowRoles } from 'src/common/decorators/role.decorator';
import { expireTimeOneDay, expireTimeOneHour, StudentListKey } from 'src/common/variables/constVariable';
import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards, Res, HttpStatus, Req } from '@nestjs/common';
import { StudentUpdateDto } from './dto/studentUpdate.dto';

@Controller('student')
export class StudentController {
    constructor(
        private readonly jwtService: JwtService,
        private readonly authService: AuthService,
        private readonly staffService: StaffService,
        private readonly redisService: RedisService,
        private readonly studentService: StudentService,
        private readonly companyService: CompanyService,
    ) { }

    @Get('me')
    @AllowRoles(['student'])
    @UseGuards(JwtGuard, RolesGuard)
    async getMyProfile(@Req() req: any, @Res() response: Response): Promise<Response> {
        try {
            const token = req.headers.authorization.split(' ')[1];
            const decodedToken = this.jwtService.decode(token) as { id: string };
            const cachedData = await this.redisService.getObjectByKey(`STUDENT:${decodedToken.id}`);
            if (cachedData) {
                return response.status(HttpStatus.OK).json(cachedData);
            }
            const findMeResult = await this.studentService.findOne(decodedToken.id);
            if (!findMeResult) {
                return response.status(HttpStatus.NOT_FOUND).json({ message: 'Student not found!' });
            }
            const limitedData = StudentResponseDto.fromStudent(findMeResult);
            await this.redisService.setObjectByKeyValue(`STUDENT:${decodedToken.id}`, limitedData, expireTimeOneHour);
            return response.status(HttpStatus.OK).json(limitedData);
        } catch (error) {
            return response.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message });
        }
    }

    // get all the student
    @Get()
    @AllowRoles(['staff', 'company'])
    @UseGuards(JwtGuard, RolesGuard)
    async findAll(@Req() req: Request, @Res() response: Response): Promise<Response> {
        try {
            const cachedData = await this.redisService.getObjectByKey(StudentListKey);
            if (cachedData) {
                return response.status(HttpStatus.OK).json(cachedData);
            }
            else {
                const findAllResult = await this.studentService.findAll();
                if (!findAllResult || findAllResult.length === 0) {
                    return response.status(HttpStatus.NOT_FOUND).json({ message: 'Student list is empty!' });
                }
                const limitedData = StudentResponseDto.fromStudentArray(findAllResult);
                await this.redisService.setObjectByKeyValue(StudentListKey, limitedData, 120);
                return response.status(HttpStatus.OK).json(limitedData);
            }
        } catch (error) {
            return response.status(error.status).json({ message: error.message });
        }
    }

    // get one student by id
    @Get(':id')
    @AllowRoles(['staff', 'company'])
    @UseGuards(JwtGuard, RolesGuard)
    async findOne(@Param('id') id: string, @Res() response: Response): Promise<Response> {
        try {
            if (!validate(id)) {
                return response.status(HttpStatus.BAD_REQUEST).json({ message: 'Invalid UUID format' });
            }
            const cachedData = await this.redisService.getObjectByKey(`STUDENT:${id}`);
            if (cachedData) {
                return response.status(HttpStatus.OK).json(cachedData);
            } else {
                const student = await this.studentService.findOne(id);
                if (!student) {
                    return response.status(HttpStatus.NOT_FOUND).json({ message: 'Student not found!' });
                }
                const limitedData = StudentResponseDto.fromStudent(student);
                await this.redisService.setObjectByKeyValue(`STUDENT:${id}`, limitedData, expireTimeOneHour);
                return response.status(HttpStatus.OK).json(limitedData);
            }
        } catch (error) {
            return response.status(error.status).json({ message: error.message });
        }
    }

    // Create a new student and return the student along with a JWT token
    @Post()
    async create(@Body() student: Student, @Res() response: Response): Promise<Response> {
        student.password = await bcrypt.hash(student.password, parseInt(process.env.BCRYPT_SALT));
        if (await this.staffService.findByEmail(student.email) || await this.studentService.findByEmail(student.email) || await this.companyService.findByEmail(student.email)) {
            return response.status(HttpStatus.CONFLICT).json({ message: 'Email already exists!' });
        }
        try {
            const newCreateStudent = await this.studentService.create(student);
            const limitedData = StudentResponseDto.fromStudent(newCreateStudent);
            await this.redisService.setObjectByKeyValue(`STUDENT:${newCreateStudent.id}`, limitedData, expireTimeOneHour);
            const token = this.authService.generateJwtToken(newCreateStudent);
            return response.status(HttpStatus.CREATED).json({ student: limitedData, token });
        } catch (error) {
            return response.status(error.status).json({ message: error.message });
        }
    }

    // update an student
    @Put(':id')
    @AllowRoles(['staff', 'student'])
    @UseGuards(JwtGuard, RolesGuard)
    async update(@Param('id') id: string, @Body() student: StudentUpdateDto, @Req() req: Request, @Res() response: Response): Promise<Response> {
        try {
            if (!validate(id)) {
                return response.status(HttpStatus.BAD_REQUEST).json({ message: 'Invalid UUID format' });
            }
            const findStudent = await this.studentService.findOne(id);
            const decodedToken = this.jwtService.decode(req.headers.authorization.split(' ')[1]) as { id: string };
            if (!(await bcrypt.compare(student.password, findStudent.password)) || id !== decodedToken.id) {
                return response.status(HttpStatus.UNAUTHORIZED).json({ message: 'Invalid credentials' });
            }
            if (student.newPassword) {
                student.password = await bcrypt.hash(student.newPassword, parseInt(process.env.BCRYPT_SALT));
                delete student.newPassword;
            }
            else {
                student.password = await bcrypt.hash(student.password, parseInt(process.env.BCRYPT_SALT));
            }
            const updateStudent = await this.studentService.update(id, student);
            if (!updateStudent) {
                return response.status(HttpStatus.NOT_FOUND).json({ message: 'Student not found!' });
            }
            const limitedData = StudentResponseDto.fromStudent(updateStudent);
            await this.redisService.setObjectByKeyValue(`STUDENT:${id}`, limitedData, expireTimeOneHour);
            return response.status(HttpStatus.OK).json(limitedData);
        } catch (error) {
            console.log(error);
            return response.status(error.status).json({ message: error.message });
        }
    }

    // delete an student
    @Delete(':id')
    @AllowRoles(['staff'])
    @UseGuards(JwtGuard, RolesGuard)
    async delete(@Param('id') id: string, @Res() response: Response): Promise<Response> {
        if (!validate(id)) {
            return response.status(HttpStatus.BAD_REQUEST).json({ message: 'Invalid UUID format' });
        }
        const student = await this.studentService.findOne(id);
        if (!student) {
            return response.status(HttpStatus.NOT_FOUND).json({ message: 'No student found!' });
        }
        await this.studentService.delete(id);
        await this.redisService.deleteObjectByKey(`STUDENT:${id}`);
        return response.status(HttpStatus.OK).json({ message: 'Student deleted successfully!' });
    }

    // login
    @Post('login')
    async login(@Req() req: Request, @Body() loginData: { email: string; password: string }, @Res() response: Response): Promise<Response> {
        try {
            const authorizationHeader = req.headers.authorization;
            if (authorizationHeader) {
                const temp = req.headers.authorization.split(' ')[1];
                const cachedData = await this.redisService.getObjectByKey(`AUTH:${temp}`);
                if (cachedData) {
                    return response.status(HttpStatus.OK).json({ token: cachedData });
                }
            }
            const student = await this.studentService.findByEmail(loginData.email);
            if (!student || !(await bcrypt.compare(loginData.password, student.password))) {
                return response.status(HttpStatus.UNAUTHORIZED).json({ message: 'Invalid credentials' });
            }
            const token = this.authService.generateJwtToken(student);
            await this.redisService.setObjectByKeyValue(`AUTH:${token}`, token, expireTimeOneDay);
            return response.status(HttpStatus.OK).json({ token });
        } catch (error) {
            return response.status(error.status).json({ message: error.message });
        }
    }

    // logout
    @Post('logout')
    @AllowRoles(['student'])
    @UseGuards(JwtGuard, RolesGuard)
    async logout(@Req() req: Request, @Res() response: Response): Promise<Response> {
        try {
            const token = req.headers.authorization.split(' ')[1];
            await this.redisService.deleteObjectByKey(`AUTH:${token}`);
            await this.redisService.setObjectByKeyValue(`BLACKLIST:${token}`, token, expireTimeOneDay);
            return response.status(HttpStatus.OK).json({ message: 'Logout successfully!' });
        } catch (error) {
            return response.status(error.status).json({ message: error.message });
        }
    }
}