import * as bcrypt from 'bcrypt';
import { Staff } from './staff.entity';
import { JwtService } from '@nestjs/jwt';
import validate = require('uuid-validate');
import { Request, Response } from 'express';
import { StaffService } from './staff.service';
import { JwtGuard } from 'src/common/guards/jwt.guard';
import { RolesGuard } from 'src/common/guards/role.guard';
import { AuthService } from 'src/module/auth/auth.service';
import { StaffResponseDto } from './dto/staffResponse.dto';
import { CompanyService } from '../company/company.service';
import { StudentService } from '../student/student.service';
import { RedisService } from 'src/module/redis/redis.service';
import { AllowRoles } from 'src/common/decorators/role.decorator';
import {
  expireTimeOneDay,
  expireTimeOneHour,
  StaffListKey,
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
import { StaffUpdateDto } from './dto/staffUpdate.dto';
import { AzureBlobService } from 'src/common/service/azureBlob.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('staff')
export class StaffController {
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
  @AllowRoles(['staff'])
  @UseGuards(JwtGuard, RolesGuard)
  async getMyProfile(
    @Req() req: any,
    @Res() response: Response,
  ): Promise<Response> {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decodedToken = this.jwtService.decode(token) as { id: string };
      const cachedData = await this.redisService.getObjectByKey(
        `STAFF:${decodedToken.id}`,
      );
      if (cachedData) {
        return response.status(HttpStatus.OK).json(cachedData);
      }
      const findMeResult = await this.staffService.findOne(decodedToken.id);
      if (!findMeResult) {
        return response
          .status(HttpStatus.NOT_FOUND)
          .json({ message: 'Staff not found!' });
      }
      const limitedData = StaffResponseDto.fromStaff(findMeResult);
      await this.redisService.setObjectByKeyValue(
        `STAFF:${decodedToken.id}`,
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

  // get all the staffs
  @Get()
  @AllowRoles(['staff'])
  @UseGuards(JwtGuard, RolesGuard)
  async findAll(
    @Req() req: Request,
    @Res() response: Response,
  ): Promise<Response> {
    try {
      const cachedData = await this.redisService.getObjectByKey(StaffListKey);
      if (cachedData) {
        return response.status(HttpStatus.OK).json(cachedData);
      } else {
        const findAllResult = await this.staffService.findAll();
        if (!findAllResult || findAllResult.length === 0) {
          return response
            .status(HttpStatus.NOT_FOUND)
            .json({ message: 'Staff list is empty!' });
        }
        const limitedData = StaffResponseDto.fromStaffArray(findAllResult);
        await this.redisService.setObjectByKeyValue(
          StaffListKey,
          limitedData,
          120,
        );
        return response.status(HttpStatus.OK).json(limitedData);
      }
    } catch (error) {
      return response.status(error.status).json({ message: error.message });
    }
  }

  // get one staff by id
  @Get(':id')
  @AllowRoles(['staff'])
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
      const cachedData = await this.redisService.getObjectByKey(`STAFF:${id}`);
      if (cachedData) {
        return response.status(HttpStatus.OK).json(cachedData);
      } else {
        const staff = await this.staffService.findOne(id);
        if (!staff) {
          return response
            .status(HttpStatus.NOT_FOUND)
            .json({ message: 'Staff not found!' });
        }
        const limitedData = StaffResponseDto.fromStaff(staff);
        await this.redisService.setObjectByKeyValue(
          `STAFF:${id}`,
          limitedData,
          expireTimeOneHour,
        );
        return response.status(HttpStatus.OK).json(limitedData);
      }
    } catch (error) {
      return response.status(error.status).json({ message: error.message });
    }
  }

  // Create a new staff and return the staff along with a JWT token
  @Post()
  @UseInterceptors(FileInterceptor('myfile'))
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() staff: Staff,
    @Res() response: Response,
  ): Promise<Response> {
    // staff.password = await bcrypt.hash(staff.password, parseInt(process.env.BCRYPT_SALT));
    if (
      (await this.staffService.findByEmail(staff.email)) ||
      (await this.studentService.findByEmail(staff.email)) ||
      (await this.companyService.findByEmail(staff.email))
    ) {
      return response
        .status(HttpStatus.CONFLICT)
        .json({ message: 'Email already exists!' });
    }
    try {
      if (file) {
        staff.avatar = await this.azureBlobService.upload(file);
      }
      const newCreateStaff = await this.staffService.create(staff);
      const limitedData = StaffResponseDto.fromStaff(newCreateStaff);
      await this.redisService.setObjectByKeyValue(
        `STAFF:${newCreateStaff.id}`,
        limitedData,
        expireTimeOneHour,
      );
      const token = this.authService.generateJwtToken(newCreateStaff);
      return response
        .status(HttpStatus.CREATED)
        .json({ staff: limitedData, token });
    } catch (error) {
      return response.status(error.status).json({ message: error.message });
    }
  }

  // update an staff
  @Put(':id')
  @AllowRoles(['staff'])
  @UseGuards(JwtGuard, RolesGuard)
  @UseInterceptors(FileInterceptor('myfile'))
  async update(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() staff: StaffUpdateDto,
    @Req() req: Request,
    @Res() response: Response,
  ): Promise<Response> {
    try {
      if (!validate(id)) {
        return response
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: 'Invalid UUID format' });
      }
      const findStaff = await this.staffService.findOne(id);
      const decodedToken = this.jwtService.decode(
        req.headers.authorization.split(' ')[1],
      ) as { id: string };
      // if (!(await bcrypt.compare(staff.password, findStaff.password)) ||
      if (id !== decodedToken.id) {
        return response
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: 'Invalid credentials' });
      }
      if (file) {
        findStaff.avatar &&
          (await this.azureBlobService.delete(
            findStaff.avatar.split('/').pop(),
          ));
        staff.avatar = await this.azureBlobService.upload(file);
      }
      const updateStaff = await this.staffService.update(id, staff);
      if (!updateStaff) {
        return response
          .status(HttpStatus.NOT_FOUND)
          .json({ message: 'Staff not found!' });
      }
      const limitedData = StaffResponseDto.fromStaff(updateStaff);
      await this.redisService.setObjectByKeyValue(
        `STAFF:${id}`,
        limitedData,
        expireTimeOneHour,
      );
      return response.status(HttpStatus.OK).json(limitedData);
    } catch (error) {
      return response.status(error.status).json({ message: error.message });
    }
  }

  // delete an staff
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
    const staff = await this.staffService.findOne(id);
    if (!staff) {
      return response
        .status(HttpStatus.NOT_FOUND)
        .json({ message: 'No staff found!' });
    }
    await this.staffService.delete(id);
    await this.redisService.deleteObjectByKey(`STAFF:${id}`);
    await this.azureBlobService.delete(staff.avatar.split('/').pop());
    return response
      .status(HttpStatus.OK)
      .json({ message: 'Staff deleted successfully!' });
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
      const staff = await this.staffService.findByEmail(loginData.email);
      if (
        !staff
        // || !(await bcrypt.compare(loginData.password, staff.password))
      ) {
        return response
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: 'Invalid credentials' });
      }
      const token = this.authService.generateJwtToken(staff);
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
  @AllowRoles(['staff'])
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
