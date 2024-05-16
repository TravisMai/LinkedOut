import { Faculty } from 'src/module/faculty/faculty.entity';
import { StudentUpdateDto } from 'src/module/student/dto/studentUpdate.dto';
import { Student } from 'src/module/student/student.entity';
import { StudentRepository } from 'src/module/student/student.repository';
import { StudentService } from 'src/module/student/student.service';
import { UpdateResult } from 'typeorm';

describe('StudentService', () => {
  let studentService: StudentService;
  let studentRepository: StudentRepository;
  const faculty: Faculty = {
    id: '',
    name: 'Engineering',
    avatar: 'avatar',
    created: new Date(),
    updated: new Date(),
  };
  const student: Student = {
    id: '1',
    name: 'John Doe',
    // add all the missing properties
    faculty: faculty,
    isVerify: false,
    studentId: 123456,
    gpa: 3.5,
    year: 2021,
    major: 'Computer Science',
    classCode: 'CS123',
    resume: [{ id: '1', title: 'title', url: 'url' }],
    isActive: true,
    process: 'pending',
    socialMedia: {
      github: 'github',
      linkedin: 'linkedin',
      google: 'google',
      facebook: 'facebook',
      twitter: 'twitter',
    },
    objective: 'objective',
    education: [],
    workingHistory: [],
    certificate: [],
    skill: [],
    additionalInformation: [],
    reference: [],
    email: '',
    phoneNumber: '',
    avatar: '',
    role: '',
    created: undefined,
    updated: undefined,
  };

  beforeEach(() => {
    const mockUserRepository: Partial<StudentRepository> = {
      find: jest.fn(),
      findOne: jest.fn(),
      createStudent: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      save: jest.fn(),
    };
    studentRepository = mockUserRepository as StudentRepository;
    studentService = new StudentService(studentRepository);
  });

  it('should be defined', () => {
    expect(studentService).toBeDefined();
  });

  it('should return a list of students', async () => {
    jest.spyOn(studentRepository, 'find').mockResolvedValue([student]);

    await expect(studentService.findAll()).resolves.toEqual([student]);
  });

  it('should return a student by id', async () => {
    jest.spyOn(studentRepository, 'findOne').mockResolvedValue(student);

    await expect(studentService.findOne('1')).resolves.toEqual(student);
  });

  it('should create a student', async () => {
    jest.spyOn(studentRepository, 'createStudent').mockResolvedValue(student);
    jest.spyOn(studentRepository, 'save').mockResolvedValue(student);

    await expect(studentService.create(student)).resolves.toEqual(student);
  });

  it('should update a student', async () => {
    const updateDto: StudentUpdateDto = {
      deleteResumeID: [],
      resumeObjective: '',
      name: '',
      email: '',
      phoneNumber: '',
      avatar: '',
      studentId: 0,
      isVerify: false,
      isActive: false,
      resume: [],
    };

    jest
      .spyOn(studentRepository, 'update')
      .mockResolvedValue({} as UpdateResult);
    jest.spyOn(studentRepository, 'findOne').mockResolvedValue(student);

    await expect(studentService.update('1', updateDto)).resolves.toEqual(
      student,
    );
  });

  it('should delete a student', async () => {
    jest
      .spyOn(studentRepository, 'delete')
      .mockResolvedValue({} as UpdateResult);

    await expect(studentService.delete('1')).resolves.not.toThrow();
  });

  it('should find a student by email', async () => {
    jest.spyOn(studentRepository, 'findOne').mockResolvedValue(student);

    await expect(studentService.findByEmail('')).resolves.toEqual(student);
  });

  it('should find a student by anything', async () => {
    jest.spyOn(studentRepository, 'findOne').mockResolvedValue(student);

    await expect(studentService.findByAnything('')).resolves.toEqual(student);
  });

  it('should find a resume by student id and resume id', async () => {
    jest.spyOn(studentRepository, 'findOne').mockResolvedValue(student);

    await expect(studentService.getResumeById('1', '1')).resolves.toEqual({
      id: '1',
      title: 'title',
      url: 'url',
    });
  });

  it('should find a resume by student id and resume id', async () => {
    const studentWithNullResume = student;
    studentWithNullResume.resume = null;
    jest.spyOn(studentRepository, 'findOne').mockResolvedValue(student);

    await expect(studentService.getResumeById('1', '1')).resolves.toEqual(null);
  });
});
