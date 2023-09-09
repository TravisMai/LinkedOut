import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { Staff } from './staffs.entity';
import validate = require('uuid-validate');
import { StaffService } from './staffs.service';
import { AuthService } from 'src/auth/auth.service';
import { JwtGuard } from 'src/common/guards/jwt.guard';
import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards, NotFoundException, Res, HttpStatus } from '@nestjs/common';

@Controller('staffs')
export class OfficersController {
    constructor(
        private readonly staffService: StaffService,
        private readonly authService: AuthService
    ) { }

    // get all the staffs
    @Get()
    @UseGuards(JwtGuard)
    async findAll(@Res() response: Response): Promise<Response> {
        const findAllResult = await this.staffService.findAll();

        if (!findAllResult || findAllResult.length === 0) {
            return response.status(HttpStatus.NOT_FOUND).json({ message: 'Staffs list is empty!' });
        }

        return response.status(HttpStatus.OK).json(findAllResult);
    }

    // get one staff by id
    @Get(':id')
    @UseGuards(JwtGuard)
    async findOne(@Param('id') id: string, @Res() response: Response): Promise<Response> {
        try {
            if (!validate(id)) {
                return response.status(HttpStatus.BAD_REQUEST).json({ message: 'Invalid UUID format' });
            }
            const staff = await this.staffService.findOne(id);

            if (!staff) {
                return response.status(HttpStatus.NOT_FOUND).json({ message: 'Staff not found!' });
            }
            return response.status(HttpStatus.OK).json(staff);
        } catch (error) {
            return response.status(error.status).json({ message: error.message });
        }
    }

    // Create a new staff and return the staff along with a JWT token
    @Post()
    async create(@Body() staff: Staff, @Res() response: Response): Promise<Response> {
        staff.role = 'staff';
        const newCreateOfficer = await this.staffService.create(staff);

        const token = this.authService.generateJwtToken(newCreateOfficer);

        return response.status(HttpStatus.CREATED).json({ staff: newCreateOfficer, token });
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
            return response.status(HttpStatus.OK).json(updateStaff);
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

        return response.status(HttpStatus.OK).json({ message: 'Staff deleted successfully!' });
    }
}
