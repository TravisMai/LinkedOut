import { Faculty } from 'src/module/faculty/faculty.entity';
import { Student } from 'src/module/student/student.entity';
import { StudentRepository } from 'src/module/student/student.repository';
import { StudentService } from 'src/module/student/student.service';

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
    resume: [],
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

  it('should add a student to the list', async () => {
    jest.spyOn(studentRepository, 'createStudent').mockResolvedValue(student);
    jest.spyOn(studentRepository, 'save').mockResolvedValue(student);

    await expect(studentService.create(student)).resolves.toEqual(student);
  });
});
