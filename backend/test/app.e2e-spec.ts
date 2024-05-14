import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app/app.module';
import { StudentModule } from '../src/module/student/student.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, StudentModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .post('/student')
      .send({
        name: 'Emmanuel',
        email: 'emches1976@gmail.com',
        phoneNumber: '+84942262713',
        studentId: '123456',
      })
      .expect(409)
      .expect('{"message":"Email already exists!"}');
  });
});
