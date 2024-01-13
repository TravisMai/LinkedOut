import {forwardRef, Module} from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import jwtConfig from 'src/common/jwt/jwt.config';
import { PassportModule } from '@nestjs/passport';
import { RedisModule } from 'src/module/redis/redis.module';
import { AuthController } from './auth.controller';
import {StudentModule} from "../student/student.module";
import {StaffModule} from "../staff/staff.module";

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: jwtConfig.secret,
      signOptions: { expiresIn: jwtConfig.signOptions.expiresIn },
    }),
    RedisModule,
    forwardRef(() => StudentModule),
    forwardRef(() => StaffModule),
  ],
  providers: [ AuthService ],
  exports: [JwtModule],
  controllers: [AuthController],
})
export class AuthModule {}
