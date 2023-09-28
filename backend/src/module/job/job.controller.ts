// import * as bcrypt from 'bcrypt';
// import { JwtService } from '@nestjs/jwt';
// import { Company } from './company.entity';
// import validate = require('uuid-validate');
// import { Request, Response } from 'express';
// import { CompanyService } from './company.service';
// import { StaffService } from '../staff/staff.service';
// import { JwtGuard } from 'src/common/guards/jwt.guard';
// import { RolesGuard } from 'src/common/guards/role.guard';
// import { AuthService } from 'src/module/auth/auth.service';
// import { StudentService } from '../student/student.service';
// import { RedisService } from 'src/module/redis/redis.service';
// import { AllowRoles } from 'src/common/decorators/role.decorator';
// import { expireTimeOneDay, expireTimeOneHour, CompanyListKey } from 'src/common/variables/constVariable';
// import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards, Res, HttpStatus, Req } from '@nestjs/common';

// @Controller('company')
// export class CompanyController {
//     constructor(
//         private readonly jwtService: JwtService,
//         private readonly authService: AuthService,
//         private readonly redisService: RedisService,
//         private readonly staffService: StaffService,
//         private readonly studentService: StudentService,
//         private readonly companyService: CompanyService,
//     ) { }

//     // get all the companys
//     @Get()
//     @AllowRoles(['staff', 'student'])
//     @UseGuards(JwtGuard, RolesGuard)
//     async findAll(@Req() req: Request, @Res() response: Response): Promise<Response> {
//         try {
//             const cachedData = await this.redisService.getObjectByKey(CompanyListKey);
//             if (cachedData) {
//                 return response.status(HttpStatus.OK).json(cachedData);
//             }
//             else {
//                 const findAllResult = await this.companyService.findAll();
//                 if (!findAllResult || findAllResult.length === 0) {
//                     return response.status(HttpStatus.NOT_FOUND).json({ message: 'Company list is empty!' });
//                 }
//                 const limitedData = CompanyResponseDto.fromCompanyArray(findAllResult);
//                 await this.redisService.setObjectByKeyValue(CompanyListKey, limitedData, 120);
//                 return response.status(HttpStatus.OK).json(limitedData);
//             }
//         } catch (error) {
//             return response.status(error.status).json({ message: error.message });
//         }
//     }

//     // get one company by id
//     @Get(':id')
//     @AllowRoles(['staff', 'student'])
//     @UseGuards(JwtGuard, RolesGuard)
//     async findOne(@Param('id') id: string, @Res() response: Response): Promise<Response> {
//         try {
//             if (!validate(id)) {
//                 return response.status(HttpStatus.BAD_REQUEST).json({ message: 'Invalid UUID format' });
//             }
//             const cachedData = await this.redisService.getObjectByKey(`COMPANY:${id}`);
//             if (cachedData) {
//                 return response.status(HttpStatus.OK).json(cachedData);
//             } else {
//                 const company = await this.companyService.findOne(id);
//                 if (!company) {
//                     return response.status(HttpStatus.NOT_FOUND).json({ message: 'Company not found!' });
//                 }
//                 const limitedData = CompanyResponseDto.fromCompany(company);
//                 await this.redisService.setObjectByKeyValue(`COMPANY:${id}`, limitedData, expireTimeOneHour);
//                 return response.status(HttpStatus.OK).json(limitedData);
//             }
//         } catch (error) {
//             return response.status(error.status).json({ message: error.message });
//         }
//     }

//     // Create a new company and return the company along with a JWT token
//     @Post()
//     async create(@Body() company: Company, @Res() response: Response): Promise<Response> {
//         company.password = await bcrypt.hash(company.password, parseInt(process.env.BCRYPT_SALT));
//         if (await this.staffService.findByEmail(company.email) || await this.studentService.findByEmail(company.email) || await this.companyService.findByEmail(company.email)) {
//             return response.status(HttpStatus.CONFLICT).json({ message: 'Email already exists!' });
//         }
//         try {
//             const newCreateCompany = await this.companyService.create(company);
//             const limitedData = CompanyResponseDto.fromCompany(newCreateCompany);
//             await this.redisService.setObjectByKeyValue(`COMPANY:${newCreateCompany.id}`, limitedData, expireTimeOneHour);
//             const token = this.authService.generateJwtToken(newCreateCompany);
//             return response.status(HttpStatus.CREATED).json({ company: limitedData, token });
//         } catch (error) {
//             return response.status(error.status).json({ message: error.message });
//         }
//     }

//     // update an company
//     @Put(':id')
//     @AllowRoles(['company', 'staff'])
//     @UseGuards(JwtGuard, RolesGuard)
//     async update(@Param('id') id: string, @Body() company: Company, @Res() response: Response): Promise<Response> {
//         try {
//             if (!validate(id)) {
//                 return response.status(HttpStatus.BAD_REQUEST).json({ message: 'Invalid UUID format' });
//             }
//             const updateCompany = await this.companyService.update(id, company);
//             if (!updateCompany) {
//                 return response.status(HttpStatus.NOT_FOUND).json({ message: 'Company not found!' });
//             }
//             const limitedData = CompanyResponseDto.fromCompany(updateCompany);
//             await this.redisService.setObjectByKeyValue(`COMPANY:${id}`, limitedData, expireTimeOneHour);
//             return response.status(HttpStatus.OK).json(limitedData);
//         } catch (error) {
//             return response.status(error.status).json({ message: error.message });
//         }
//     }

//     // delete an company
//     @Delete(':id')
//     @AllowRoles(['company', 'staff'])
//     @UseGuards(JwtGuard, RolesGuard)
//     async delete(@Param('id') id: string, @Res() response: Response): Promise<Response> {
//         if (!validate(id)) {
//             return response.status(HttpStatus.BAD_REQUEST).json({ message: 'Invalid UUID format' });
//         }
//         const company = await this.companyService.findOne(id);
//         if (!company) {
//             return response.status(HttpStatus.NOT_FOUND).json({ message: 'No company found!' });
//         }
//         await this.companyService.delete(id);
//         await this.redisService.deleteObjectByKey(`COMPANY:${id}`);
//         return response.status(HttpStatus.OK).json({ message: 'Company deleted successfully!' });
//     }
// }
