import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Company } from './company.entity';
import validate = require('uuid-validate');
import { Request, Response } from 'express';
import { CompanyService } from './company.service';
import { StaffService } from '../staff/staff.service';
import { JwtGuard } from 'src/common/guards/jwt.guard';
import { RolesGuard } from 'src/common/guards/role.guard';
import { AuthService } from 'src/module/auth/auth.service';
import { StudentService } from '../student/student.service';
import { RedisService } from 'src/module/redis/redis.service';
import { CompanyResponseDto } from './dto/companyResponse.dto';
import { AllowRoles } from 'src/common/decorators/role.decorator';
import {
  expireTimeOneDay,
  expireTimeOneHour,
  CompanyListKey,
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
} from '@nestjs/common';
import { CompanyUpdateDto } from './dto/companyUpdate.dto';
import { AzureBlobService } from 'src/common/service/azureBlob.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { StaffUpdateCompanyDto } from './dto/staffUpdateCompany.dto';

@Controller('company')
export class CompanyController {
  constructor(
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
    private readonly redisService: RedisService,
    private readonly staffService: StaffService,
    private readonly studentService: StudentService,
    private readonly companyService: CompanyService,
    private readonly azureBlobService: AzureBlobService,
  ) {}

  @Get('me')
  @AllowRoles(['company'])
  @UseGuards(JwtGuard, RolesGuard)
  async getMyProfile(
    @Req() req: any,
    @Res() response: Response,
  ): Promise<Response> {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decodedToken = this.jwtService.decode(token) as { id: string };
      const cachedData = await this.redisService.getObjectByKey(
        `COMPANY:${decodedToken.id}`,
      );
      if (cachedData) {
        return response.status(HttpStatus.OK).json(cachedData);
      }
      const findMeResult = await this.companyService.findOne(decodedToken.id);
      if (!findMeResult) {
        return response
          .status(HttpStatus.NOT_FOUND)
          .json({ message: 'Company not found!' });
      }
      const limitedData = CompanyResponseDto.fromCompany(findMeResult);
      await this.redisService.setObjectByKeyValue(
        `COMPANY:${decodedToken.id}`,
        limitedData,
        expireTimeOneHour,
      );
      return response.status(HttpStatus.OK).json(limitedData);
    } catch (error) {
      return response
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }

  // get all the companys
  @Get()
  @AllowRoles(['staff', 'student'])
  @UseGuards(JwtGuard, RolesGuard)
  async findAll(
    @Req() req: Request,
    @Res() response: Response,
  ): Promise<Response> {
    try {
      const cachedData = await this.redisService.getObjectByKey(CompanyListKey);
      if (cachedData) {
        return response.status(HttpStatus.OK).json(cachedData);
      } else {
        const findAllResult = await this.companyService.findAll();
        if (!findAllResult || findAllResult.length === 0) {
          return response
            .status(HttpStatus.NOT_FOUND)
            .json({ message: 'Company list is empty!' });
        }
        const limitedData = CompanyResponseDto.fromCompanyArray(findAllResult);
        await this.redisService.setObjectByKeyValue(
          CompanyListKey,
          limitedData,
          120,
        );
        return response.status(HttpStatus.OK).json(limitedData);
      }
    } catch (error) {
      return response
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }

  // get one company by id
  @Get(':id')
  @AllowRoles(['staff', 'student'])
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
        `COMPANY:${id}`,
      );
      if (cachedData) {
        return response.status(HttpStatus.OK).json(cachedData);
      } else {
        const company = await this.companyService.findOne(id);
        if (!company) {
          return response
            .status(HttpStatus.NOT_FOUND)
            .json({ message: 'Company not found!' });
        }
        const limitedData = CompanyResponseDto.fromCompany(company);
        await this.redisService.setObjectByKeyValue(
          `COMPANY:${id}`,
          limitedData,
          expireTimeOneHour,
        );
        return response.status(HttpStatus.OK).json(limitedData);
      }
    } catch (error) {
      return response
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }

  // Create a new company and return the company along with a JWT token
  @Post()
  @UseInterceptors(FileInterceptor('myfile'))
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() company: Company,
    @Res() response: Response,
  ): Promise<Response> {
    company.password = await bcrypt.hash(
      company.password,
      parseInt(process.env.BCRYPT_SALT),
    );
    if (
      (await this.staffService.findByEmail(company.email)) ||
      (await this.studentService.findByEmail(company.email)) ||
      (await this.companyService.findByEmail(company.email))
    ) {
      return response
        .status(HttpStatus.CONFLICT)
        .json({ message: 'Email already exists!' });
    }
    try {
      if (file) {
        company.avatar = await this.azureBlobService.upload(file);
      }
      const newCreateCompany = await this.companyService.create(company);
      const limitedData = CompanyResponseDto.fromCompany(newCreateCompany);
      await this.redisService.setObjectByKeyValue(
        `COMPANY:${newCreateCompany.id}`,
        limitedData,
        expireTimeOneHour,
      );
      const token = this.authService.generateJwtToken(newCreateCompany);
      return response
        .status(HttpStatus.CREATED)
        .json({ company: limitedData, token });
    } catch (error) {
      return response
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }

  // update an company
  @Put(':id')
  @AllowRoles(['company'])
  @UseGuards(JwtGuard, RolesGuard)
  @UseInterceptors(FileInterceptor('myfile'))
  async update(
    @UploadedFile() file: Express.Multer.File,
    @Param('id') id: string,
    @Body() company: CompanyUpdateDto,
    @Req() req: Request,
    @Res() response: Response,
  ): Promise<Response> {
    try {
      if (!validate(id)) {
        return response
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: 'Invalid UUID format' });
      }
      const findCompany = await this.companyService.findOne(id);
      const decodedToken = this.jwtService.decode(
        req.headers.authorization.split(' ')[1],
      ) as { id: string };
      if (
        !(await bcrypt.compare(company.password, findCompany.password)) ||
        id !== decodedToken.id
      ) {
        return response
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: 'Invalid credentials' });
      }
      if (company.newPassword) {
        company.password = await bcrypt.hash(
          company.newPassword,
          parseInt(process.env.BCRYPT_SALT),
        );
        delete company.newPassword;
      } else {
        company.password = await bcrypt.hash(
          company.password,
          parseInt(process.env.BCRYPT_SALT),
        );
      }
      if (file) {
        findCompany.avatar &&
          (await this.azureBlobService.delete(
            findCompany.avatar.split('/').pop(),
          ));
        company.avatar = await this.azureBlobService.upload(file);
      }
      const updateCompany = await this.companyService.update(id, company);
      if (!updateCompany) {
        return response
          .status(HttpStatus.NOT_FOUND)
          .json({ message: 'Company not found!' });
      }
      const limitedData = CompanyResponseDto.fromCompany(updateCompany);
      await this.redisService.setObjectByKeyValue(
        `COMPANY:${id}`,
        limitedData,
        expireTimeOneHour,
      );
      await this.redisService.deleteObjectByKey(CompanyListKey);
      return response.status(HttpStatus.OK).json(limitedData);
    } catch (error) {
      return response
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }

  // update an company by staff
  @Put('staff/:id')
  @AllowRoles(['staff'])
  @UseGuards(JwtGuard, RolesGuard)
  async staffUpdateCompany(
    @Param('id') id: string,
    @Body() company: StaffUpdateCompanyDto,
    @Res() response: Response,
  ): Promise<Response> {
    try {
      if (!validate(id)) {
        return response
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: 'Invalid UUID format' });
      }
      const updateCompany = await this.companyService.staffUpdate(id, company);
      if (!updateCompany) {
        return response
          .status(HttpStatus.NOT_FOUND)
          .json({ message: 'Company not found!' });
      }
      const limitedData = CompanyResponseDto.fromCompany(updateCompany);
      await this.redisService.setObjectByKeyValue(
        `COMPANY:${id}`,
        limitedData,
        expireTimeOneHour,
      );
      await this.redisService.deleteObjectByKey(CompanyListKey);
      return response.status(HttpStatus.OK).json(limitedData);
    } catch (error) {
      return response
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }

  // delete an company
  @Delete(':id')
  @AllowRoles(['company', 'staff'])
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
    const company = await this.companyService.findOne(id);
    if (!company) {
      return response
        .status(HttpStatus.NOT_FOUND)
        .json({ message: 'No company found!' });
    }
    await this.companyService.delete(id);
    await this.redisService.deleteObjectByKey(`COMPANY:${id}`);
    await this.redisService.deleteObjectByKey(CompanyListKey);
    await this.azureBlobService.delete(company.avatar.split('/').pop());
    return response
      .status(HttpStatus.OK)
      .json({ message: 'Company deleted successfully!' });
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
      const company = await this.companyService.findByEmail(loginData.email);
      if (
        !company ||
        !(await bcrypt.compare(loginData.password, company.password))
      ) {
        return response
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: 'Invalid credentials' });
      }
      const token = this.authService.generateJwtToken(company);
      await this.redisService.setObjectByKeyValue(
        `AUTH:${token}`,
        token,
        expireTimeOneDay,
      );
      return response.status(HttpStatus.OK).json({ token });
    } catch (error) {
      return response
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }

  // logout
  @Post('logout')
  @AllowRoles(['company'])
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
      return response
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }
}
