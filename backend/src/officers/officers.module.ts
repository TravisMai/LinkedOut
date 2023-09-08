import { Module } from '@nestjs/common';
import { OfficersController } from './officers.controller';
import { OfficersService } from './officers.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Officer } from './officers.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Officer])],
  controllers: [OfficersController],
  providers: [OfficersService]
})
export class OfficersModule {}
