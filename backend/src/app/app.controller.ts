import { JwtGuard } from 'src/common/guards/jwt.guard';
import { Request, Response } from 'express';
import {
  Controller,
  Res,
  HttpStatus,
  UseGuards,
  Req,
  Body,
  Post,
} from '@nestjs/common';
import { AppService } from './app.service';

@Controller('app')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  @UseGuards(JwtGuard)
  async search(
    @Req() req: Request,
    @Res() response: Response,
    @Body('search') search: string,
  ): Promise<Response> {
    try {
      // take the search and pass to the service
      const searchResult = await this.appService.search(search);
      return response.status(HttpStatus.OK).json(searchResult);
    } catch (error) {
      return response.status(error.status).json({ message: error.message });
    }
  }
}
