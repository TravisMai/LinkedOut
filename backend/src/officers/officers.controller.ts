import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { OfficersService } from './officers.service';
import { Officer } from './officers.entity';


@Controller('officers')
export class OfficersController {
    constructor(private readonly officersService: OfficersService) { }

    // get all the officers
    @Get()
    findAll(): Promise<Officer[]> {
        return this.officersService.findAll();
    }

    // get one officer by id
    @Get(':id')
    findOne(@Param('id') id: string): Promise<Officer> {
        const officer = this.officersService.findOne(id);
        if (!officer) {
            throw new Error('No officer found!');
        } else {
            return officer;
        }
    }

    // create a new officer
    @Post()
    async create(@Body() officer: Officer): Promise<Officer> {
        return this.officersService.create(officer);
    }

    // update an officer
    @Put(':id')
    async update(@Param('id') id: string, @Body() officer: Officer): Promise<Officer> {
        return this.officersService.update(id, officer);
    }

    // delete an officer
    @Delete(':id')
    async delete(@Param('id') id: string): Promise<void> {
        const officer = await this.officersService.findOne(id);
        if (!officer) {
            throw new Error('No officer found!');
        }
        await this.officersService.delete(id);
    }
}
