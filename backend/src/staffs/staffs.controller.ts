import * as bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { Staff } from './staffs.entity';
import validate = require('uuid-validate');
import { StaffService } from './staffs.service';
import { AuthService } from 'src/auth/auth.service';
import { JwtGuard } from 'src/common/guards/jwt.guard';
import { RedisService } from 'src/redis/redis.service';
import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards, NotFoundException, Res, HttpStatus, Req } from '@nestjs/common';
import { StaffResponseDto } from './dto/staffResponse.dto';
import { expireTimeOneDay, expireTimeOneHour, StaffListKey } from 'src/common/variable/constVariable';

@Controller('staffs')
export class StaffsController {
    constructor(
        private readonly staffService: StaffService,
        private readonly authService: AuthService,
        private readonly redisService: RedisService
    ) { }

    @Get('me')
    @UseGuards(JwtGuard)
    async getMyProfile(@Req() req: any, @Res() response: Response): Promise<Response> {
        try {
            const staffId = req.user.id;
            const findMeResult = await this.staffService.findOne(staffId);
            if (!findMeResult) {
                return response.status(HttpStatus.NOT_FOUND).json({ message: 'Staff not found!' });
            }
            const limitedData = StaffResponseDto.fromStaff(findMeResult);
            return response.status(HttpStatus.OK).json(limitedData);
        } catch (error) {
            return response.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message });
        }
    }

    // get all the staffs
    @Get()
    @UseGuards(JwtGuard)
    async findAll(@Res() response: Response): Promise<Response> {
        try {
            const cachedData = await this.redisService.getObjectByKey(StaffListKey);
            if (cachedData) {
                return response.status(HttpStatus.OK).json(cachedData);
            }
            else {
                const findAllResult = await this.staffService.findAll();
                if (!findAllResult || findAllResult.length === 0) {
                    return response.status(HttpStatus.NOT_FOUND).json({ message: 'Staffs list is empty!' });
                }
                const limitedData = StaffResponseDto.fromStaffArray(findAllResult);
                await this.redisService.setObjectByKeyValue(StaffListKey, limitedData, 120);
                return response.status(HttpStatus.OK).json(limitedData);
            }
        } catch (error) {
            return response.status(error.status).json({ message: error.message });
        }
    }

    // get one staff by id
    @Get(':id')
    @UseGuards(JwtGuard)
    async findOne(@Param('id') id: string, @Res() response: Response): Promise<Response> {
        try {
            if (!validate(id)) {
                return response.status(HttpStatus.BAD_REQUEST).json({ message: 'Invalid UUID format' });
            }
            const cachedData = await this.redisService.getObjectByKey(`STAFF:${id}`);
            if (cachedData) {
                return response.status(HttpStatus.OK).json(cachedData);
            } else {
                const staff = await this.staffService.findOne(id);
                if (!staff) {
                    return response.status(HttpStatus.NOT_FOUND).json({ message: 'Staff not found!' });
                }
                const limitedData = StaffResponseDto.fromStaff(staff);
                await this.redisService.setObjectByKeyValue(`STAFF:${id}`, limitedData, expireTimeOneHour);
                return response.status(HttpStatus.OK).json(limitedData);
            }
        } catch (error) {
            return response.status(error.status).json({ message: error.message });
        }
    }




    // Create a new staff and return the staff along with a JWT token
    @Post()
    async create(@Body() staff: Staff, @Res() response: Response): Promise<Response> {
        staff.role = 'staff';
        staff.password = await bcrypt.hash(staff.password, parseInt(process.env.BCRYPT_SALT));
        try {
            const newCreateStaff = await this.staffService.create(staff);
            const limitedData = StaffResponseDto.fromStaff(newCreateStaff);
            await this.redisService.setObjectByKeyValue(`STAFF:${newCreateStaff.id}`, limitedData, expireTimeOneHour);
            const token = this.authService.generateJwtToken(newCreateStaff);
            return response.status(HttpStatus.CREATED).json({ staff: limitedData, token });
        } catch (error) {
            return response.status(error.status).json({ message: error.message });
        }
    }

    // update an staff
    @Put(':id')
    @UseGuards(JwtGuard)
    async update(@Param('id') id: string, @Body() staff: Staff, @Res() response: Response): Promise<Response> {
        try {
            if (!validate(id)) {
                return response.status(HttpStatus.BAD_REQUEST).json({ message: 'Invalid UUID format' });
            }
            const updateStaff = await this.staffService.update(id, staff);
            if (!updateStaff) {
                return response.status(HttpStatus.NOT_FOUND).json({ message: 'Staff not found!' });
            }
            const limitedData = StaffResponseDto.fromStaff(updateStaff);
            await this.redisService.setObjectByKeyValue(`STAFF:${id}`, limitedData, expireTimeOneHour);
            return response.status(HttpStatus.OK).json(limitedData);
        } catch (error) {
            return response.status(error.status).json({ message: error.message });
        }
    }

    // delete an staff
    @Delete(':id')
    @UseGuards(JwtGuard)
    async delete(@Param('id') id: string, @Res() response: Response): Promise<Response> {
        if (!validate(id)) {
            return response.status(HttpStatus.BAD_REQUEST).json({ message: 'Invalid UUID format' });
        }
        const staff = await this.staffService.findOne(id);
        if (!staff) {
            return response.status(HttpStatus.NOT_FOUND).json({ message: 'No staff found!' });
        }
        await this.staffService.delete(id);
        await this.redisService.deleteObjectByKey(`STAFF:${id}`);
        return response.status(HttpStatus.OK).json({ message: 'Staff deleted successfully!' });
    }

    // login
    @Post('login')
    async login(@Req() req: Request, @Body() loginData: { email: string; password: string }, @Res() response: Response): Promise<Response> {
        try {
            const temp = req.headers.authorization.split(' ')[1];
            const cachedData = await this.redisService.getObjectByKey(`AUTH:${temp}`);
            if (cachedData) {
                return response.status(HttpStatus.OK).json({ token: cachedData });
            }
            const staff = await this.staffService.findByEmail(loginData.email);
            if (!staff || !(await bcrypt.compare(loginData.password, staff.password))) {
                return response.status(HttpStatus.UNAUTHORIZED).json({ message: 'Invalid credentials' });
            }
            const token = this.authService.generateJwtToken(staff);
            await this.redisService.setObjectByKeyValue(`AUTH:${token}`, token, expireTimeOneDay);
            return response.status(HttpStatus.OK).json({ token });
        } catch (error) {
            return response.status(error.status).json({ message: error.message });
        }
    }

    // logout
    @Post('logout')
    @UseGuards(JwtGuard)
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
